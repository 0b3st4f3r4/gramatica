/**
 * Caderno de Margem: caderno local de caso. A entrada percorre as sete
 * perguntas e mantém o portão operacional separado do posto da derivação.
 */
import { useMemo, useState } from "react";
import { Plus, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EditorialMark } from "@/components/EditorialMark";
import { AttestationIndexPanel } from "@/components/AttestationIndexPanel";
import { LocalHistoryPanel } from "@/components/LocalHistoryPanel";
import { TrajectoryPanel } from "@/components/TrajectoryPanel";
import {
  DEFAULT_PARALLEL_WALLETS,
  DERIVATION_LABELS,
  EMPTY_NOTEBOOK,
  FORM_LABELS,
  LEAK_VERDICTS,
  MEASUREMENT_LABELS,
  POLICY,
  SCENARIOS,
  archiveTrajectoryBranch,
  createAttestation,
  createAttestationIndexEntry,
  createLedgerEntry,
  createReexamination,
  createReexaminationDeadline,
  createTrajectoryBranch,
  declaredEvidence,
  digestFile,
  evaluate,
  missingNotebookDeclarations,
  reopenTrajectoryBranch,
  type AttestationIndexEntry,
  type CaseNotebook,
  type CostVector,
  type CurrencyWallet,
  type DecisionState,
  type DivergenceComment,
  type EvidenceRecord,
  type LedgerEntry,
  type LeakVerdict,
  type MovementDecision,
  type Reexamination,
  type ReexaminationDeadline,
  type ScenarioKey,
  type TrajectoryBranch,
  reexaminationDeadlineStatus,
} from "@/lib/rmv";
import { clearLocalLabHistory, createLocalLabHistory, loadLocalLabHistory, saveLocalLabHistory } from "@/lib/labHistory";

type CaseDraft = { notebook: CaseNotebook; evidence: string[]; evidenceEnvelope: EvidenceRecord[]; costVector: CostVector };

const stateCopy: Record<DecisionState, { label: string; description: string }> = {
  accept: { label: "ADMITIDO PELO PORTÃO", description: "O caso satisfez a política operacional atual. O posto da derivação segue em leitura separada." },
  deny: { label: "RETIDO PELO PORTÃO", description: "A política operacional reteve o caso. O motivo permanece na razão e pode receber reexame situado." },
  indeterminate: { label: "PORTÃO EM ABERTO", description: "Falta evidência ou declaração necessária. O caso permanece em aberto." },
};

const costLabels: Record<keyof CostVector, string> = { reservation: "reserva", usage: "uso", shared: "partilha", idle: "ociosidade", repair: "reparo" };

function cloneScenario(key: ScenarioKey): CaseDraft {
  const event = SCENARIOS[key].event;
  return { notebook: { ...event.notebook, blindSpot: { ...event.notebook.blindSpot } }, evidence: [...event.evidence], evidenceEnvelope: [...event.evidenceEnvelope], costVector: { ...event.costVector } };
}

function downloadJson(filename: string, value: unknown) {
  const blob = new Blob([JSON.stringify(value, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

export function RmvLab() {
  const [scenarioKey, setScenarioKey] = useState<ScenarioKey | null>("accepted");
  const [draft, setDraft] = useState<CaseDraft>(() => cloneScenario("accepted"));
  const [decision, setDecision] = useState<MovementDecision | null>(null);
  const [ledger, setLedger] = useState<LedgerEntry[]>([]);
  const [decisions, setDecisions] = useState<MovementDecision[]>([]);
  const [reexaminations, setReexaminations] = useState<Reexamination[]>([]);
  const [deadlines, setDeadlines] = useState<ReexaminationDeadline[]>([]);
  const [divergenceComments, setDivergenceComments] = useState<DivergenceComment[]>([]);
  const [attestationIndex, setAttestationIndex] = useState<AttestationIndexEntry[]>([]);
  const [wallets, setWallets] = useState<CurrencyWallet[]>(() => DEFAULT_PARALLEL_WALLETS.map((wallet) => ({ ...wallet })));
  const [branches, setBranches] = useState<TrajectoryBranch[]>([]);
  const [activeBranchId, setActiveBranchId] = useState("tronco");
  const [historyEnabled, setHistoryEnabled] = useState(false);
  const [historySavedAt, setHistorySavedAt] = useState<string | null>(null);
  const [reexamination, setReexamination] = useState({ verdict: "application-artifact" as LeakVerdict, observation: "" });
  const [deadlineDraft, setDeadlineDraft] = useState({ dueAt: "", note: "" });
  const [busy, setBusy] = useState(false);
  const [digesting, setDigesting] = useState(false);

  const totalCost = useMemo(() => Object.values(draft.costVector).reduce((sum, value) => sum + value, 0).toFixed(2), [draft.costVector]);
  const missingDeclarations = useMemo(() => missingNotebookDeclarations(draft.notebook), [draft.notebook]);

  function loadScenario(key: ScenarioKey) {
    setScenarioKey(key);
    setDraft(cloneScenario(key));
    setDecision(null);
  }

  function startCase() {
    setScenarioKey(null);
    setDraft({ notebook: { ...EMPTY_NOTEBOOK, blindSpot: { ...EMPTY_NOTEBOOK.blindSpot } }, evidence: [], evidenceEnvelope: [], costVector: { reservation: 0, usage: 0, shared: 0, idle: 0, repair: 0 } });
    setDecision(null);
  }

  function updateNotebook<K extends keyof CaseNotebook>(key: K, value: CaseNotebook[K]) {
    setDraft((current) => ({ ...current, notebook: { ...current.notebook, [key]: value } }));
  }

  function updateBlindSpot<K extends keyof CaseNotebook["blindSpot"]>(key: K, value: CaseNotebook["blindSpot"][K]) {
    setDraft((current) => ({ ...current, notebook: { ...current.notebook, blindSpot: { ...current.notebook.blindSpot, [key]: value } } }));
  }

  function updateCost(key: keyof CostVector, value: string) {
    const parsed = Number(value);
    setDraft((current) => ({ ...current, costVector: { ...current.costVector, [key]: Number.isFinite(parsed) && parsed >= 0 ? parsed : 0 } }));
  }

  function toggleEvidence(label: string) {
    setDraft((current) => {
      const alreadyPresent = current.evidence.includes(label);
      return {
        ...current,
        evidence: alreadyPresent ? current.evidence.filter((item) => item !== label) : [...current.evidence, label],
        evidenceEnvelope: alreadyPresent
          ? current.evidenceEnvelope.filter((record) => record.id !== `declared:${label}`)
          : [...current.evidenceEnvelope, ...declaredEvidence([label])],
      };
    });
  }

  async function addEvidenceFiles(files: FileList | null) {
    if (!files?.length) return;
    setDigesting(true);
    const records = await Promise.all(Array.from(files).map(async (file) => ({
      id: `file:${crypto.randomUUID()}`,
      kind: "file" as const,
      label: file.name,
      recordedAt: new Date().toISOString(),
      digest: await digestFile(file),
      file: { name: file.name, type: file.type || "tipo não declarado", bytes: file.size, lastModified: file.lastModified },
    })));
    setDraft((current) => ({ ...current, evidenceEnvelope: [...current.evidenceEnvelope, ...records] }));
    setDigesting(false);
  }

  function removeEvidenceRecord(id: string) {
    setDraft((current) => ({ ...current, evidenceEnvelope: current.evidenceEnvelope.filter((record) => record.id !== id) }));
  }

  async function executeMovement() {
    setBusy(true);
    const activeBranch = branches.find((branch) => branch.id === activeBranchId);
    if (activeBranch?.archivedAt) {
      setBusy(false);
      return;
    }
    const event = {
      id: `urn:gdm:browser:case-${crypto.randomUUID()}`,
      source: "urn:gdm:site:lab",
      type: POLICY.allowedType,
      subject: draft.notebook.title || "caso-sem-nome",
      time: new Date().toISOString(),
      evidence: draft.evidence,
      evidenceEnvelope: draft.evidenceEnvelope,
      costVector: draft.costVector,
      notebook: draft.notebook,
    };
    const evaluated = await evaluate(event);
    const nextDecision = { ...evaluated, branchId: activeBranchId };
    const previousInBranch = [...ledger].reverse().find((entry) => entry.branchId === activeBranchId) ?? (activeBranch ? ledger.find((entry) => entry.entryHash === activeBranch.sourceLedgerHash) : ledger.at(-1));
    const entry = await createLedgerEntry(nextDecision, previousInBranch, activeBranchId);
    setDecision(nextDecision);
    setDecisions((current) => [...current, nextDecision]);
    setLedger((current) => [...current, entry]);
    setBusy(false);
  }

  function recordReexamination() {
    if (!decision || !reexamination.observation.trim()) return;
    setReexaminations((current) => [...current, createReexamination(decision, reexamination.verdict, reexamination.observation.trim())]);
    setReexamination({ verdict: "application-artifact", observation: "" });
  }

  function recordDeadline() {
    if (!decision || !deadlineDraft.dueAt) return;
    setDeadlines((current) => [...current, createReexaminationDeadline(decision, new Date(`${deadlineDraft.dueAt}T23:59:59`).toISOString(), deadlineDraft.note)]);
    setDeadlineDraft({ dueAt: "", note: "" });
  }

  async function exportAttestation() {
    if (!decision) return;
    const attestation = await createAttestation(decision, ledger, reexaminations, deadlines);
    setAttestationIndex((current) => [...current, createAttestationIndexEntry(decision, ledger, attestation.generatedAt)]);
    downloadJson(`caderno-${decision.state}-${ledger.length}.json`, attestation);
  }

  function openBranch(source: LedgerEntry, reason: string, label: string) {
    const branch = createTrajectoryBranch(source, reason, label);
    setBranches((current) => [...current, branch]);
    setActiveBranchId(branch.id);
    setDecision(null);
  }

  function archiveBranch(branchId: string, reason: string) {
    setBranches((current) => current.map((branch) => branch.id === branchId ? archiveTrajectoryBranch(branch, reason) : branch));
    if (activeBranchId === branchId) setActiveBranchId("tronco");
  }

  function reopenBranch(branchId: string, reason: string) {
    setBranches((current) => current.map((branch) => branch.id === branchId ? reopenTrajectoryBranch(branch, reason) : branch));
    setActiveBranchId(branchId);
    setDecision(null);
  }

  function saveHistory() {
    const snapshot = createLocalLabHistory(decisions, ledger, reexaminations, deadlines, divergenceComments, wallets, branches);
    if (saveLocalLabHistory(snapshot)) setHistorySavedAt(snapshot.savedAt);
  }

  function restoreHistory() {
    const snapshot = loadLocalLabHistory();
    if (!snapshot) return;
    setDecisions(snapshot.decisions);
    setLedger(snapshot.ledger);
    setReexaminations(snapshot.reexaminations);
    setDeadlines(snapshot.deadlines);
    setDivergenceComments(snapshot.divergenceComments);
    setWallets(snapshot.wallets);
    setBranches(snapshot.branches);
    setDecision(snapshot.decisions.at(-1) ?? null);
    setActiveBranchId("tronco");
    setHistorySavedAt(snapshot.savedAt);
  }

  function clearHistory() {
    clearLocalLabHistory();
    setHistoryEnabled(false);
    setHistorySavedAt(null);
  }

  function resetSession() {
    setDecision(null);
    setDecisions([]);
    setLedger([]);
    setReexaminations([]);
    setDeadlines([]);
    setDivergenceComments([]);
    setAttestationIndex([]);
    setWallets(DEFAULT_PARALLEL_WALLETS.map((wallet) => ({ ...wallet })));
    setBranches([]);
    setActiveBranchId("tronco");
  }

  return (
    <section className="rmv-lab" id="caderno-de-caso" aria-labelledby="lab-title">
      <div className="rmv-lab-heading">
        <div>
          <p className="rmv-kicker"><EditorialMark className="rmv-kicker-mark" /> CADERNO DE CASO · SESSÃO LOCAL</p>
          <h2 id="lab-title">Declare o caso antes de pedir uma decisão.</h2>
        </div>
        <p>O portão aplica a política. O posto da derivação depende da moeda, do mapa de cegueira e das declarações anteriores ao resultado.</p>
      </div>

      <aside className="rmv-margin-apparatus" aria-label="Aparelho de margem do laboratório">
        <EditorialMark className="rmv-apparatus-mark" />
        <span>APARELHO DE MARGEM</span>
        <ol><li>CASO</li><li>PROVA</li><li>REGRA</li><li>DECISÃO</li><li>POSTO</li><li>RAZÃO</li></ol>
      </aside>

      <div className="rmv-how" aria-label="Como funciona o caderno">
        <div><span>01</span><p><strong>Escreva o recorte.</strong> As sete perguntas dão ao caso forma, hospedeiro, moeda, troca, escala e refluxo.</p></div>
        <div><span>02</span><p><strong>Fixe as marcas.</strong> Evidências, digests e custo passam por um portão local, sem sair do navegador.</p></div>
        <div><span>03</span><p><strong>Abra o retorno.</strong> A decisão, o posto e o reexame ficam separados na razão desta sessão.</p></div>
      </div>
      <div className="rmv-case-source" aria-label="Origem do caso">
        <div><span className="rmv-field-label">CASOS DIDÁTICOS</span><p>Carregue um percurso pronto ou inicie um caderno próprio. Os exemplos exercitam o método; a auditoria externa fica fora deste laboratório.</p></div>
        <div className="rmv-scenario-tabs">
          {(Object.keys(SCENARIOS) as ScenarioKey[]).map((key) => <button key={key} type="button" className={scenarioKey === key ? "is-selected" : ""} onClick={() => loadScenario(key)}>{SCENARIOS[key].label}</button>)}
          <button type="button" className={scenarioKey === null ? "is-selected" : ""} onClick={startCase}><Plus size={13} /> Novo caso</button>
        </div>
      </div>

      <div className="rmv-notebook" aria-label="Sete perguntas do caso">
        <fieldset className="rmv-question rmv-question-wide"><legend>01 · O QUE É?</legend><div className="rmv-question-grid"><label>Nome do caso<input value={draft.notebook.title} onChange={(event) => updateNotebook("title", event.target.value)} placeholder="Nomeie o recorte" /></label><label>Forma<select value={draft.notebook.form} onChange={(event) => updateNotebook("form", event.target.value as CaseNotebook["form"])}>{Object.entries(FORM_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label><label className="rmv-span-all">Comportamento previsto<textarea value={draft.notebook.expectedBehavior} onChange={(event) => updateNotebook("expectedBehavior", event.target.value)} placeholder="O que ocorreria se a troca cessasse ou a propagação parasse?" /></label></div></fieldset>
        <fieldset className="rmv-question"><legend>02 · O QUE ALCANÇA QUEM OBSERVA?</legend><label>Observador e instrumento<textarea value={draft.notebook.observer} onChange={(event) => updateNotebook("observer", event.target.value)} placeholder="Quem observa e com que meio?" /></label></fieldset>
        <fieldset className="rmv-question"><legend>03 · COMO É NOMEADO?</legend><label>Nomeação do caso<textarea value={draft.notebook.designation} onChange={(event) => updateNotebook("designation", event.target.value)} placeholder="Qual nome fixa este recorte?" /></label></fieldset>
        <fieldset className="rmv-question rmv-question-wide"><legend>04 · O QUE PERSISTE, E A QUE CUSTO?</legend><div className="rmv-question-grid"><label>Horizonte<input value={draft.notebook.horizon} onChange={(event) => updateNotebook("horizon", event.target.value)} placeholder="Em que duração?" /></label><label>Hospedeiro<input value={draft.notebook.host} onChange={(event) => updateNotebook("host", event.target.value)} placeholder="Quem paga a manutenção?" /></label><label>Moeda<input value={draft.notebook.currency} onChange={(event) => updateNotebook("currency", event.target.value)} placeholder="Moeda declarada" /></label><label>Unidade<input value={draft.notebook.currencyUnit} onChange={(event) => updateNotebook("currencyUnit", event.target.value)} placeholder="Unidade da moeda" /></label></div></fieldset>
        <fieldset className="rmv-question"><legend>05 · O QUE ELE TROCA?</legend><label>Troca identificável<textarea value={draft.notebook.exchange} onChange={(event) => updateNotebook("exchange", event.target.value)} placeholder="O que sustenta a forma?" /></label></fieldset>
        <fieldset className="rmv-question"><legend>06 · EM QUE ESCALA É MEDIDO?</legend><label>Escala<input value={draft.notebook.scale} onChange={(event) => updateNotebook("scale", event.target.value)} placeholder="Qual régua torna o caso legível?" /></label><label>Estatuto da medida<select value={draft.notebook.measurementStatus} onChange={(event) => updateNotebook("measurementStatus", event.target.value as CaseNotebook["measurementStatus"])}>{Object.entries(MEASUREMENT_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label></fieldset>
        <fieldset className="rmv-question"><legend>07 · PARA ONDE REFLUI?</legend><label>Refluxo declarado<textarea value={draft.notebook.reflux} onChange={(event) => updateNotebook("reflux", event.target.value)} placeholder="Como o recorte se dissolve ou reabre?" /></label></fieldset>
      </div>
      <p className="rmv-register-note"><EditorialMark /><span><strong>FORMA DO REGISTRO.</strong> Linhas e células delimitam onde a declaração entra; o caso, o instrumento, o arquivo e o custo permanecem fora da caixa e devem aparecer em suas condições próprias.</span></p>

      {draft.notebook.measurementStatus === "proxy" && <fieldset className="rmv-blind-spot" aria-label="Mapa de cegueira do proxy"><legend>MAPA DE CEGUEIRA · DECLARADO ANTES DO TESTE</legend><p>O proxy declara o que deixa de ver. O mapa torna esse limite examinável antes do resultado.</p><div><label>Fonte do proxy<input value={draft.notebook.blindSpot.source} onChange={(event) => updateBlindSpot("source", event.target.value)} placeholder="De onde vem o indicador?" /></label><label>Recorte<input value={draft.notebook.blindSpot.scope} onChange={(event) => updateBlindSpot("scope", event.target.value)} placeholder="Que casos ele alcança?" /></label><label>Direção de erro<textarea value={draft.notebook.blindSpot.errorDirection} onChange={(event) => updateBlindSpot("errorDirection", event.target.value)} placeholder="Como tende a errar?" /></label><label>Troca não vista<textarea value={draft.notebook.blindSpot.unseenExchange} onChange={(event) => updateBlindSpot("unseenExchange", event.target.value)} placeholder="Que troca o indicador não registra?" /></label><label>Data da declaração<input type="date" value={draft.notebook.blindSpot.declaredAt.slice(0, 10)} onChange={(event) => updateBlindSpot("declaredAt", event.target.value)} /></label></div></fieldset>}

      <div className="rmv-evidence-register">
        <section><span className="rmv-field-label">EVIDÊNCIAS E CUSTO DA POLÍTICA</span><p>A política atual pede commit, lockfile e build e só soma componentes da mesma moeda declarada.</p><div className="rmv-evidence-checks">{POLICY.requiredEvidence.map((item) => <label key={item}><input type="checkbox" checked={draft.evidence.includes(item)} onChange={() => toggleEvidence(item)} /> {item}</label>)}</div></section>
        <section className="rmv-cost-editor" aria-label="Componentes de custo">{(Object.keys(draft.costVector) as Array<keyof CostVector>).map((key) => <label key={key}>{costLabels[key]}<input type="number" min="0" step="0.01" value={draft.costVector[key]} onChange={(event) => updateCost(key, event.target.value)} /></label>)}<strong>total da moeda: {totalCost} {draft.notebook.currencyUnit}</strong></section>
      </div>

      <div className="rmv-envelope"><div><span className="rmv-field-label">ENVELOPE LOCAL DE EVIDÊNCIAS</span><p>Escolha arquivos do dispositivo para calcular um digest SHA-256. O conteúdo permanece no dispositivo; esta sessão retém nome, metadados e digest.</p></div><label className="rmv-file-input"><EditorialMark className="rmv-file-mark" /><span>{digesting ? "Calculando digests…" : "Selecionar arquivos locais"}</span><input type="file" multiple onChange={(event) => { void addEvidenceFiles(event.target.files); event.currentTarget.value = ""; }} disabled={digesting} /></label>{draft.evidenceEnvelope.length ? <ol>{draft.evidenceEnvelope.map((record) => <li key={record.id}><span>{record.kind === "file" ? "ARQUIVO" : "DECLARADO"}</span><div><strong>{record.label}</strong><small>{record.digest ? `${record.digest.slice(0, 26)}… · ${record.file?.bytes ?? 0} bytes` : "evidência declarada pela política"}</small></div>{record.kind === "file" && <button type="button" onClick={() => removeEvidenceRecord(record.id)}>remover</button>}</li>)}</ol> : <p className="rmv-empty">O envelope ainda não contém evidências.</p>}</div>

      <div className="rmv-separator-register"><span className="rmv-field-label">OBSERVAÇÃO SEPARADORA E POSTO</span><div><label>Observação declarada antes da execução<textarea value={draft.notebook.separatingObservation} onChange={(event) => updateNotebook("separatingObservation", event.target.value)} placeholder="Que observação separaria as leituras?" /></label><label>Modo<select value={draft.notebook.observationMode} onChange={(event) => updateNotebook("observationMode", event.target.value as CaseNotebook["observationMode"])}><option value="number">Número</option><option value="contour">Contorno</option><option value="none">Ainda não há observação separadora</option></select></label></div></div>

      <div className="rmv-execution-row"><div><span className="rmv-field-label">PRONTIDÃO DO CADERNO</span><p>{branches.find((branch) => branch.id === activeBranchId)?.archivedAt ? "O ramo ativo está arquivado. As posições seguem legíveis; escolha o tronco, abra outro ramo ou reabra este antes de uma decisão nova." : missingDeclarations.length ? `Faltam: ${missingDeclarations.join(" · ")}. O portão permanecerá em aberto.` : "As sete perguntas e o mapa de cegueira, quando necessário, têm declaração mínima. A execução verifica evidências e custo."}</p></div><Button className="rmv-execute" type="button" onClick={executeMovement} disabled={busy || digesting || Boolean(branches.find((branch) => branch.id === activeBranchId)?.archivedAt)}><EditorialMark className="rmv-action-mark" /> {busy ? "Aplicando a regra…" : "Aplicar política local"}</Button></div>

      <div className="rmv-results" aria-live="polite"><section className={`rmv-decision ${decision ? `state-${decision.state}` : ""}`}><span className="rmv-field-label">A · DECISÃO OPERACIONAL</span>{decision ? <><div className="rmv-state-line"><EditorialMark className="rmv-state-mark" /><strong>{stateCopy[decision.state].label}</strong></div><p>{stateCopy[decision.state].description}</p><dl><div><dt>motivo</dt><dd>{decision.reasonCodes.length ? decision.reasonCodes.join(" · ") : "POLÍTICA SATISFEITA"}</dd></div><div><dt>reentrada</dt><dd>{decision.reentry}</dd></div></dl></> : <p className="rmv-empty">A execução registra o que a política admitiu, reteve ou manteve em aberto.</p>}</section><section className="rmv-derivation" aria-label="Posto da derivação"><span className="rmv-field-label">B · FORÇA DA DERIVAÇÃO</span>{decision ? <><div className="rmv-state-line"><EditorialMark className="rmv-state-mark" /><strong>{decision.derivation.label}</strong></div><p>{decision.derivation.reason}</p><dl><div><dt>medida</dt><dd>{MEASUREMENT_LABELS[decision.notebook.measurementStatus]}</dd></div><div><dt>observação</dt><dd>{decision.notebook.observationMode === "number" ? "número" : decision.notebook.observationMode === "contour" ? "contorno" : "não declarada"}</dd></div></dl></> : <p className="rmv-empty">O posto parte da moeda e da observação separadora; o resultado do portão não o define.</p>}</section></div>

      {decision && <section className="rmv-reexamination" aria-label="Reexame e catálogo de falhas"><div><span className="rmv-field-label">E · REEXAME E CATÁLOGO DE FALHAS</span><p>Uma objeção abre uma entrada datada. Ela classifica artefato, limite, falha da cláusula ou deslocamento da troca e mantém a decisão anterior legível.</p></div><div className="rmv-reexamination-form"><label>Veredito<select value={reexamination.verdict} onChange={(event) => setReexamination((current) => ({ ...current, verdict: event.target.value as LeakVerdict }))}>{Object.entries(LEAK_VERDICTS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label><label>Observação do reexame<textarea value={reexamination.observation} onChange={(event) => setReexamination((current) => ({ ...current, observation: event.target.value }))} placeholder="Que vazamento, correção ou deslocamento a revisão encontrou?" /></label><Button type="button" variant="outline" onClick={recordReexamination} disabled={!reexamination.observation.trim()}>Registrar reexame</Button></div><div className="rmv-deadline-form"><div><span className="rmv-field-label">PRAZO DECLARADO</span><p>O prazo registra uma expectativa situada. Quando vence, assinala que o retorno ainda não entrou na razão.</p></div><label>Data-limite<input type="date" value={deadlineDraft.dueAt} onChange={(event) => setDeadlineDraft((current) => ({ ...current, dueAt: event.target.value }))} /></label><label>Nota do prazo<input value={deadlineDraft.note} onChange={(event) => setDeadlineDraft((current) => ({ ...current, note: event.target.value }))} placeholder="O que pede retorno até esta data?" /></label><Button type="button" variant="outline" onClick={recordDeadline} disabled={!deadlineDraft.dueAt}>Declarar prazo</Button></div>{deadlines.length ? <ol className="rmv-deadline-register">{deadlines.map((deadline) => { const status = reexaminationDeadlineStatus(deadline, reexaminations); return <li key={deadline.id} className={`deadline-${status}`}><strong>{status === "pending" ? "AGUARDA REEXAME" : status === "reexamined" ? "REEXAME REGISTRADO" : "PRAZO VENCIDO"}</strong><span>até {new Date(deadline.dueAt).toLocaleDateString("pt-BR")}</span><p>{deadline.note}</p></li>; })}</ol> : <p className="rmv-empty">Nenhum prazo de reexame foi declarado nesta sessão.</p>}{reexaminations.length ? <ol className="rmv-failure-catalog">{reexaminations.map((entry, index) => <li key={entry.id}><span>{String(index + 1).padStart(2, "0")}</span><div><strong>{LEAK_VERDICTS[entry.verdict]}</strong><p>{entry.observation}</p><small>{entry.consequence}</small></div><em>{entry.nextRank ? entry.nextRank === "revogado" ? "DERIVAÇÃO REVOGADA" : `POSTO: ${DERIVATION_LABELS[entry.nextRank]}` : "POSTO PRESERVADO"}</em></li>)}</ol> : <p className="rmv-empty">Nenhum reexame foi registrado nesta sessão.</p>}</section>}

      <TrajectoryPanel decisions={decisions} reexaminations={reexaminations} ledger={ledger} wallets={wallets} branches={branches} activeBranchId={activeBranchId} comments={divergenceComments} onWalletsChange={setWallets} onBranchOpen={openBranch} onBranchArchive={archiveBranch} onBranchReopen={reopenBranch} onBranchSelect={setActiveBranchId} onCommentsChange={setDivergenceComments} />

      <LocalHistoryPanel enabled={historyEnabled} savedAt={historySavedAt} hasSession={Boolean(decisions.length || ledger.length || reexaminations.length || divergenceComments.length || branches.length)} onEnabledChange={setHistoryEnabled} onSave={saveHistory} onRestore={restoreHistory} onClear={clearHistory} />

      <div className="rmv-evidence-grid"><section className="rmv-cost" aria-label="Resumo do custo"><span className="rmv-field-label">C · CUSTO DA MESMA MOEDA</span>{(Object.keys(draft.costVector) as Array<keyof CostVector>).map((key) => <div key={key} className="rmv-cost-row"><span>{costLabels[key]}</span><strong>{draft.costVector[key].toFixed(2)}</strong></div>)}<div className="rmv-cost-total"><span>total</span><strong>{totalCost} <em>{draft.notebook.currencyUnit}</em></strong></div></section><section className="rmv-ledger" aria-label="Razão encadeada local"><div className="rmv-ledger-header"><span className="rmv-field-label">D · RAZÃO DESTA SESSÃO</span><span>{ledger.length} {ledger.length === 1 ? "entrada" : "entradas"}</span></div>{ledger.length ? <ol>{ledger.map((entry) => <li key={entry.entryHash} className={`ledger-${entry.state}`}><span>{String(entry.sequence).padStart(2, "0")}</span><div><strong>{stateCopy[entry.state].label} · {DERIVATION_LABELS[entry.derivationRank]}</strong><small>{entry.entryHash.replace("sha256:", "").slice(0, 18)}…</small></div></li>)}</ol> : <p className="rmv-empty">A razão começa vazia. Cada execução encadeia uma decisão e seu posto à entrada anterior.</p>}<div className="rmv-export-row"><Button variant="outline" className="rmv-export" type="button" onClick={exportAttestation} disabled={!decision}><EditorialMark className="rmv-export-mark" /> Baixar caderno atestado</Button><button className="rmv-reset" type="button" onClick={resetSession} disabled={!ledger.length}><RotateCcw size={14} /> limpar sessão</button></div></section></div>
      <AttestationIndexPanel entries={attestationIndex} />
      <p className="rmv-privacy-note">O caderno reside nesta aba. A exportação reúne declarações, metadados, digests, política, reexames e razão da sessão. Arquivos, contas, assinatura de identidade e auditoria externa ficam fora de sua função.</p>
    </section>
  );
}
