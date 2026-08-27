/**
 * Caderno de Margem: instrumento local de trajetória. Compara posições e
 * pacotes por seus metadados, sem reter arquivos importados ou converter moedas.
 */
import { useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EditorialMark } from "@/components/EditorialMark";
import {
  DEFAULT_PARALLEL_WALLETS,
  DERIVATION_LABELS,
  FORM_LABELS,
  LEAK_VERDICTS,
  MEASUREMENT_LABELS,
  buildTrajectory,
  compareImportedAttestation,
  createDivergenceComment,
  createDivergenceReport,
  createTrajectoryExport,
  filterDivergences,
  filterTrajectoryByBranch,
  inspectImportedAttestation,
  type CurrencyWallet,
  type DivergenceComment,
  type ImportedAttestation,
  type LedgerEntry,
  type MovementDecision,
  type Reexamination,
  type TrajectoryBranch,
} from "@/lib/rmv";

type Props = {
  decisions: MovementDecision[];
  reexaminations: Reexamination[];
  ledger: LedgerEntry[];
  wallets: CurrencyWallet[];
  branches: TrajectoryBranch[];
  activeBranchId: string;
  comments: DivergenceComment[];
  onWalletsChange: (wallets: CurrencyWallet[]) => void;
  onBranchOpen: (source: LedgerEntry, reason: string, label: string) => void;
  onBranchArchive: (branchId: string, reason: string) => void;
  onBranchReopen: (branchId: string, reason: string) => void;
  onBranchSelect: (branchId: string) => void;
  onCommentsChange: (comments: DivergenceComment[]) => void;
};

const decisionLabels = { accept: "ADMITIDO", deny: "RETIDO", indeterminate: "EM ABERTO" } as const;

function downloadJson(filename: string, value: unknown) {
  const blob = new Blob([JSON.stringify(value, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

export function TrajectoryPanel({ decisions, reexaminations, ledger, wallets, branches, activeBranchId, comments, onWalletsChange, onBranchOpen, onBranchArchive, onBranchReopen, onBranchSelect, onCommentsChange }: Props) {
  const [imported, setImported] = useState<ImportedAttestation | null>(null);
  const [branchDraft, setBranchDraft] = useState({ sourceHash: "", label: "", reason: "" });
  const [matrixBranch, setMatrixBranch] = useState<string | "all">("all");
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({});
  const [archiveReason, setArchiveReason] = useState("");
  const [reopenReason, setReopenReason] = useState("");
  const [divergenceFilter, setDivergenceFilter] = useState<"all" | "divergent" | string>("all");
  const trajectory = useMemo(() => buildTrajectory(decisions, reexaminations), [decisions, reexaminations]);
  const visibleTrajectory = useMemo(() => filterTrajectoryByBranch(trajectory, matrixBranch), [trajectory, matrixBranch]);
  const comparison = useMemo(() => compareImportedAttestation(decisions.at(-1) ?? null, ledger, imported), [decisions, ledger, imported]);
  const branchLabels = useMemo(() => new Map(branches.map((branch) => [branch.id, branch.label])), [branches]);
  const activeBranch = branches.find((branch) => branch.id === activeBranchId);
  const visibleDifferences = useMemo(() => filterDivergences(comparison.differences, divergenceFilter), [comparison.differences, divergenceFilter]);

  function updateWallet(id: string, key: keyof CurrencyWallet, value: string) {
    onWalletsChange(wallets.map((wallet) => {
      if (wallet.id !== id) return wallet;
      if (key === "amount") return { ...wallet, amount: Math.max(0, Number(value) || 0) };
      return { ...wallet, [key]: value };
    }));
  }

  function addWallet() {
    const index = wallets.length + 1;
    onWalletsChange([...wallets, { id: `wallet-${crypto.randomUUID()}`, currency: `moeda paralela ${index}`, unit: "unidade declarada", scope: "escopo a declarar", amount: 0 }]);
  }

  function removeWallet(id: string) {
    onWalletsChange(wallets.filter((wallet) => wallet.id !== id));
  }

  async function importAttestation(file: File | undefined) {
    if (!file) return;
    try {
      const text = await file.text();
      setImported(inspectImportedAttestation(JSON.parse(text)));
    } catch {
      setImported({ valid: false, type: null, generatedAt: null, policyDigest: null, ledgerHead: null, ledgerEntries: null, scope: null, decisionState: null, derivationRank: null, form: null, currency: null, issues: ["O arquivo não pôde ser lido como uma atestação JSON."] });
    }
  }

  function openBranchFromDraft() {
    const source = ledger.find((entry) => entry.entryHash === branchDraft.sourceHash) ?? ledger.at(-1);
    if (!source) return;
    onBranchOpen(source, branchDraft.reason, branchDraft.label);
    setBranchDraft({ sourceHash: "", label: "", reason: "" });
  }

  function exportDivergenceReport() {
    const localDecision = decisions.at(-1);
    if (!localDecision || !imported?.valid || !comparison.ready) return;
    downloadJson("relatorio-de-divergencias-local.json", createDivergenceReport(localDecision, ledger, imported, comparison, comments));
  }

  function exportFilteredTrajectory() {
    const branch = branches.find((entry) => entry.id === matrixBranch);
    const label = matrixBranch === "all" ? "todos os ramos" : matrixBranch === "tronco" ? "tronco" : branch?.label ?? "ramo sem nome";
    const source = matrixBranch === "all" || matrixBranch === "tronco" ? "origem comum da sessão" : branch?.sourceLedgerHash ?? "origem não declarada";
    downloadJson(`trajetoria-${matrixBranch === "all" ? "completa" : matrixBranch}.json`, createTrajectoryExport(visibleTrajectory, matrixBranch, label, source));
  }

  function recordComment(difference: typeof comparison.differences[number]) {
    const text = commentDrafts[difference.field]?.trim();
    if (!text) return;
    onCommentsChange([...comments, createDivergenceComment(difference, text)]);
    setCommentDrafts((current) => ({ ...current, [difference.field]: "" }));
  }

  function archiveActiveBranch() {
    if (!activeBranch || activeBranch.archivedAt) return;
    onBranchArchive(activeBranch.id, archiveReason);
    setArchiveReason("");
  }

  function reopenActiveBranch() {
    if (!activeBranch || !activeBranch.archivedAt) return;
    onBranchReopen(activeBranch.id, reopenReason);
    setReopenReason("");
  }

  return (
    <section className="rmv-trajectory" aria-labelledby="trajectory-title">
      <div className="rmv-trajectory-heading">
        <div>
          <p className="rmv-kicker"><EditorialMark className="rmv-kicker-mark" /> F · TRAJETÓRIA E CONFRONTO</p>
          <h2 id="trajectory-title">A razão organiza sequência, moeda e ruptura.</h2>
        </div>
        <p>A matriz mantém em separado posições de moedas ou trajetórias distintas. Cada uma aparece em seu próprio escopo; a comparação depende do que foi declarado.</p>
      </div>

      <div className="rmv-trajectory-matrix" aria-label="Matriz de trajetória local">
        <div className="trajectory-filter"><span className="rmv-field-label">LEITURA DA MATRIZ</span><label>Ramo exibido<select value={matrixBranch} onChange={(event) => setMatrixBranch(event.target.value)}><option value="all">todos os ramos · origem comum preservada</option><option value="tronco">tronco · sequência inicial</option>{branches.map((branch) => <option key={branch.id} value={branch.id}>{branch.label} · da posição {branch.sourcePosition}{branch.archivedAt ? " · arquivado" : ""}</option>)}</select></label><p>{matrixBranch === "all" ? "Todos os ramos mantêm sua origem comum e suas sequências próprias." : `O ramo escolhido parte da posição ${branches.find((branch) => branch.id === matrixBranch)?.sourcePosition ?? "de bifurcação"}.`}</p><Button type="button" variant="outline" className="rmv-trajectory-export" onClick={exportFilteredTrajectory} disabled={!visibleTrajectory.length}><EditorialMark className="rmv-report-mark" /> Exportar recorte</Button></div>
        <div className="trajectory-matrix-head"><span>POSIÇÃO</span><span>RAMO</span><span>FORMA</span><span>MOEDA</span><span>PORTÃO</span><span>POSTO</span><span>RUPTURA</span></div>
        {visibleTrajectory.length ? visibleTrajectory.map((step) => <div className="trajectory-matrix-row" key={step.decisionId}><span>{String(trajectory.findIndex((candidate) => candidate.decisionId === step.decisionId) + 1).padStart(2, "0")}</span><span>{step.branchId === "tronco" ? "TRONCO" : branchLabels.get(step.branchId) ?? "ramo não nomeado"}</span><span>{FORM_LABELS[step.form]}</span><span>{step.currency}</span><span>{decisionLabels[step.decision]}</span><span>{DERIVATION_LABELS[step.rank]}</span><span>{step.ruptures.length ? step.ruptures.map((verdict) => LEAK_VERDICTS[verdict]).join(" · ") : "—"}</span></div>) : <p className="rmv-empty">Ainda não há posição neste ramo. A origem permanece declarada, mas nenhuma decisão foi inscrita depois da bifurcação.</p>}
      </div>

      <section className="rmv-branches" aria-labelledby="branches-title">
        <div><span className="rmv-field-label">BIFURCAÇÃO DECLARADA</span><h3 id="branches-title">Abrir outra hipótese desde a posição de partida.</h3><p>Um ramo começa em uma entrada já registrada, preserva a cabeça de origem e recebe as próximas decisões em sequência própria.</p></div>
        <div className="branch-form"><label>Posição de partida<select value={branchDraft.sourceHash} onChange={(event) => setBranchDraft((current) => ({ ...current, sourceHash: event.target.value }))} disabled={!ledger.length}><option value="">última posição do caderno</option>{ledger.map((entry) => <option key={entry.entryHash} value={entry.entryHash}>posição {entry.sequence} · {entry.branchId}</option>)}</select></label><label>Nome do ramo<input value={branchDraft.label} onChange={(event) => setBranchDraft((current) => ({ ...current, label: event.target.value }))} placeholder="Hipótese alternativa" /></label><label>Motivo da bifurcação<textarea value={branchDraft.reason} onChange={(event) => setBranchDraft((current) => ({ ...current, reason: event.target.value }))} placeholder="Que condição, regra ou troca pede outro percurso?" /></label><Button type="button" variant="outline" disabled={!ledger.length} onClick={openBranchFromDraft}><EditorialMark className="rmv-action-mark" /> Abrir ramo</Button></div>
        <div className="branch-register"><span className="rmv-field-label">RAMO EM CURSO</span><button type="button" className={activeBranchId === "tronco" ? "is-active" : ""} onClick={() => onBranchSelect("tronco")}>TRONCO · sequência inicial</button>{branches.map((branch) => <button type="button" key={branch.id} className={activeBranchId === branch.id ? "is-active" : ""} onClick={() => onBranchSelect(branch.id)}><strong>{branch.label}{branch.archivedAt ? " · ARQUIVADO" : ""}</strong><small>da posição {branch.sourcePosition} · {branch.archivedAt ? branch.archiveReason : branch.reason}</small></button>)}{activeBranch && <div className="branch-archive"><span className="rmv-field-label">{activeBranch.archivedAt ? "REABRIR RAMO" : "ARQUIVAR RAMO"}</span>{activeBranch.archivedAt ? <><p>Arquivado em {new Date(activeBranch.archivedAt).toLocaleDateString("pt-BR")}. As posições permanecem legíveis, e a reabertura será outro ato datado na história do ramo.</p><label>Motivo da reabertura<input value={reopenReason} onChange={(event) => setReopenReason(event.target.value)} placeholder="Que condição pede outra decisão?" /></label><Button type="button" variant="outline" onClick={reopenActiveBranch}><EditorialMark className="rmv-report-mark" /> Reabrir ramo</Button>{activeBranch.archiveHistory?.length ? <ol className="branch-history">{activeBranch.archiveHistory.map((record) => <li key={record.archivedAt}>arquivado: {new Date(record.archivedAt).toLocaleDateString("pt-BR")} · {record.reason}{record.reopenedAt ? ` · reaberto: ${new Date(record.reopenedAt).toLocaleDateString("pt-BR")}` : ""}</li>)}</ol> : null}</> : <><label>Motivo de encerramento<input value={archiveReason} onChange={(event) => setArchiveReason(event.target.value)} placeholder="Por que este ramo se encerra?" /></label><Button type="button" variant="outline" onClick={archiveActiveBranch}><EditorialMark className="rmv-report-mark" /> Arquivar ramo</Button></>}</div>}</div>
      </section>

      <section className="rmv-wallets" aria-labelledby="wallets-title">
        <div className="rmv-wallets-heading"><div><span className="rmv-field-label">CARTEIRAS DE MOEDAS PARALELAS</span><h3 id="wallets-title">Cada moeda conserva sua própria unidade.</h3></div><p>Uma carteira torna uma consequência legível em sua unidade. Câmbio automático, total geral e saldo equivalente não pertencem a este registro.</p></div>
        <div className="rmv-wallet-register">
          {wallets.map((wallet) => <div className="wallet-row" key={wallet.id}><label>Moeda<input value={wallet.currency} onChange={(event) => updateWallet(wallet.id, "currency", event.target.value)} /></label><label>Unidade<input value={wallet.unit} onChange={(event) => updateWallet(wallet.id, "unit", event.target.value)} /></label><label>Escopo<input value={wallet.scope} onChange={(event) => updateWallet(wallet.id, "scope", event.target.value)} /></label><label>Quantidade<input type="number" min="0" step="0.01" value={wallet.amount} onChange={(event) => updateWallet(wallet.id, "amount", event.target.value)} /></label><strong>{wallet.amount.toFixed(2)} <em>{wallet.unit}</em></strong><button type="button" onClick={() => removeWallet(wallet.id)} aria-label={`Remover carteira ${wallet.currency}`}><Trash2 size={14} /></button></div>)}
        </div>
        <div className="rmv-wallet-actions"><Button type="button" variant="outline" onClick={addWallet}><Plus size={15} /> Adicionar moeda paralela</Button><p>Moedas iniciais: <strong>{DEFAULT_PARALLEL_WALLETS.map((wallet) => wallet.currency).join(" · ")}</strong>. Você pode reescrever seus nomes e escopos nesta sessão.</p></div>
      </section>

      <section className="rmv-import" aria-labelledby="import-title">
        <div><span className="rmv-field-label">PACOTE DE OUTRO APLICADOR</span><h3 id="import-title">Confronte uma atestação na própria margem.</h3><p>Escolha um JSON exportado por outro caderno. A leitura ocorre nesta aba e usa os metadados necessários ao confronto; arquivo e conteúdo não entram na razão local.</p></div>
        <div className="rmv-import-workbench"><label className="rmv-file-input"><EditorialMark className="rmv-file-mark" /><span>Escolher atestação JSON</span><input type="file" accept="application/json,.json" onChange={(event) => { void importAttestation(event.target.files?.[0]); event.currentTarget.value = ""; }} /></label>{imported ? <div className={`rmv-import-result ${imported.valid ? "is-valid" : "is-invalid"}`}><strong>{imported.valid ? "PACOTE LIDO LOCALMENTE" : "PACOTE NÃO RECONHECIDO"}</strong><p>{imported.valid ? `${imported.type} · ${imported.ledgerEntries} entrada(s) · ${imported.generatedAt ?? "data não declarada"}` : imported.issues.join(" ")}</p></div> : <p className="rmv-empty">Nenhum pacote foi escolhido nesta sessão.</p>}</div>
        <div className="rmv-comparison" aria-live="polite"><span className="rmv-field-label">RELATÓRIO DE DIVERGÊNCIAS</span>{comparison.notes.map((note) => <p key={note}>{note}</p>)}{comparison.ready && <><label className="difference-filter">Campos exibidos<select value={divergenceFilter} onChange={(event) => setDivergenceFilter(event.target.value)}><option value="all">todos os campos declarados</option><option value="divergent">somente divergências</option>{comparison.differences.map((difference) => <option key={difference.field} value={difference.field}>{difference.field}</option>)}</select></label><div className="difference-register">{visibleDifferences.map((difference) => <div key={difference.field} className={difference.equal ? "is-same" : "is-different"}><strong>{difference.field}</strong><span>{difference.equal ? "coincide" : difference.equal === null ? "não declarado" : "diverge"}</span><small>local: {difference.local.slice(0, 30)}{difference.local.length > 30 ? "…" : ""}<br />importado: {difference.imported.slice(0, 30)}{difference.imported.length > 30 ? "…" : ""}</small><label>Comentário situado<textarea value={commentDrafts[difference.field] ?? ""} onChange={(event) => setCommentDrafts((current) => ({ ...current, [difference.field]: event.target.value }))} placeholder="O que esta diferença muda, sustenta ou deixa aberto?" /></label><Button type="button" variant="outline" disabled={!commentDrafts[difference.field]?.trim()} onClick={() => recordComment(difference)}>Anotar</Button>{comments.filter((comment) => comment.field === difference.field).map((comment) => <p key={comment.id} className="difference-comment">{comment.text}</p>)}</div>)}</div><Button type="button" variant="outline" className="rmv-report-export" onClick={exportDivergenceReport}><EditorialMark className="rmv-report-mark" /> Exportar relatório local</Button></>}</div>
      </section>
    </section>
  );
}
