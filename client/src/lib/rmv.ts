/**
 * Caderno de Margem: gramática executável local. O motor separa o portão
 * operacional da força de uma derivação e não envia dados ao exterior.
 */

export type DecisionState = "accept" | "deny" | "indeterminate";
export type ScenarioKey = "accepted" | "denied" | "indeterminate";
export type FormKind = "event" | "equilibrium" | "maintained";
export type MeasurementStatus = "measured" | "proxy" | "metaphor";
export type ObservationMode = "number" | "contour" | "none";
export type DerivationRank = "prediction-number" | "prediction-contour" | "ordering" | "illustration";
export type LeakVerdict = "application-artifact" | "empirical-limit" | "clause-failure" | "exchange-shift";

export type CostVector = { reservation: number; usage: number; shared: number; idle: number; repair: number };

export type EvidenceRecord = {
  id: string;
  kind: "declared" | "file";
  label: string;
  recordedAt: string;
  digest?: string;
  file?: { name: string; type: string; bytes: number; lastModified: number };
};

export type BlindSpotMap = {
  source: string;
  scope: string;
  errorDirection: string;
  unseenExchange: string;
  declaredAt: string;
};

export type CaseNotebook = {
  title: string;
  form: FormKind;
  expectedBehavior: string;
  observer: string;
  designation: string;
  horizon: string;
  host: string;
  currency: string;
  currencyUnit: string;
  measurementStatus: MeasurementStatus;
  exchange: string;
  scale: string;
  reflux: string;
  separatingObservation: string;
  observationMode: ObservationMode;
  blindSpot: BlindSpotMap;
};

export type MovementEvent = {
  id: string;
  source: string;
  type: string;
  subject: string;
  time: string;
  evidence: string[];
  evidenceEnvelope: EvidenceRecord[];
  costVector: CostVector;
  notebook: CaseNotebook;
};

export type DerivationStatus = { rank: DerivationRank; reason: string; label: string };

export type MovementDecision = {
  id: string;
  event: Pick<MovementEvent, "id" | "source" | "subject" | "time" | "type">;
  notebook: CaseNotebook;
  state: DecisionState;
  reasonCodes: string[];
  missingEvidence: string[];
  missingDeclarations: string[];
  evidenceEnvelope: EvidenceRecord[];
  policy: { id: string; version: string; digest: string };
  cost: CostVector & { total: number; currency: string; allocationRule: string };
  derivation: DerivationStatus;
  reviewAfter: string | null;
  reentry: string;
  evaluatedAt: string;
  branchId: string;
};

export type LedgerEntry = {
  sequence: number;
  previousHash: string;
  decisionId: string;
  decisionDigest: string;
  state: DecisionState;
  derivationRank: DerivationRank;
  recordedAt: string;
  entryHash: string;
  branchId: string;
};

export type Reexamination = {
  id: string;
  decisionId: string;
  observation: string;
  verdict: LeakVerdict;
  recordedAt: string;
  priorRank: DerivationRank;
  nextRank: DerivationRank | "revogado" | null;
  consequence: string;
};

export type ReexaminationDeadline = {
  id: string;
  decisionId: string;
  dueAt: string;
  declaredAt: string;
  note: string;
};

export type CurrencyWallet = {
  id: string;
  currency: string;
  unit: string;
  scope: string;
  amount: number;
};

export type TrajectoryStep = {
  decisionId: string;
  recordedAt: string;
  form: FormKind;
  currency: string;
  decision: DecisionState;
  rank: DerivationRank;
  ruptures: LeakVerdict[];
  branchId: string;
};

export type TrajectoryBranch = {
  id: string;
  label: string;
  sourceDecisionId: string;
  sourceLedgerHash: string;
  sourcePosition: number;
  reason: string;
  openedAt: string;
  archivedAt?: string;
  archiveReason?: string;
  archiveHistory?: BranchArchiveRecord[];
  reopenedAt?: string;
  reopenReason?: string;
};

export type BranchArchiveRecord = {
  archivedAt: string;
  reason: string;
  reopenedAt?: string;
  reopenReason?: string;
};

export type DivergenceComment = {
  id: string;
  field: string;
  local: string;
  imported: string;
  text: string;
  recordedAt: string;
};

export type ImportedAttestation = {
  valid: boolean;
  type: string | null;
  generatedAt: string | null;
  policyDigest: string | null;
  ledgerHead: string | null;
  ledgerEntries: number | null;
  scope: string | null;
  decisionState: DecisionState | null;
  derivationRank: DerivationRank | null;
  form: FormKind | null;
  currency: string | null;
  issues: string[];
};

export type AttestationComparison = {
  ready: boolean;
  samePolicy: boolean | null;
  sameLedgerHead: boolean | null;
  notes: string[];
  differences: Array<{ field: string; local: string; imported: string; equal: boolean | null }>;
};

export type DivergenceReport = {
  _type: "org.gramatica.local-divergence-report/v1";
  generatedAt: string;
  scope: string;
  local: { decisionId: string; policyDigest: string; ledgerHead: string };
  imported: { type: string | null; generatedAt: string | null; scope: string | null };
  fields: AttestationComparison["differences"];
  comments: DivergenceComment[];
  limits: string[];
};

export type TrajectoryExport = {
  _type: "org.gramatica.local-trajectory-export/v1";
  generatedAt: string;
  scope: string;
  branch: { id: string | "all"; label: string; source: string };
  steps: TrajectoryStep[];
  limits: string[];
};

export type AttestationIndexEntry = {
  id: string;
  generatedAt: string;
  decisionId: string;
  branchId: string;
  state: DecisionState;
  rank: DerivationRank;
  policyDigest: string;
  ledgerHead: string;
};

export const FORM_LABELS: Record<FormKind, string> = {
  event: "Evento — extingue-se se parar de se propagar",
  equilibrium: "Estrutura em equilíbrio — persiste sem gasto neste aspecto",
  maintained: "Estrutura fora do equilíbrio — colapsa se a troca cessar",
};

export const MEASUREMENT_LABELS: Record<MeasurementStatus, string> = {
  measured: "Moeda mensurável",
  proxy: "Medida difícil, com proxy declarado",
  metaphor: "Metáfora controlada",
};

export const DERIVATION_LABELS: Record<DerivationRank, string> = {
  "prediction-number": "PREVISÃO POR NÚMERO",
  "prediction-contour": "PREVISÃO POR CONTORNO",
  ordering: "ORDENAÇÃO",
  illustration: "ILUSTRAÇÃO",
};

export const LEAK_VERDICTS: Record<LeakVerdict, string> = {
  "application-artifact": "Artefato de aplicação",
  "empirical-limit": "Limite da gramática empírica",
  "clause-failure": "Falha da cláusula",
  "exchange-shift": "Deslocamento da troca",
};

export const DEFAULT_PARALLEL_WALLETS: CurrencyWallet[] = [
  { id: "tempo", currency: "tempo de espera", unit: "minutos", scope: "tempo percebido pela pessoa que aguarda a decisão", amount: 0 },
  { id: "reparo", currency: "reparo", unit: "ocorrências", scope: "intervenções posteriores necessárias para sustentar o caso", amount: 0 },
];

export const POLICY = {
  id: "org.gramatica.publication-gate",
  version: "1.2.0",
  allowedType: "org.gramatica.publicacao.v1",
  requiredEvidence: ["commit", "lockfile", "build"],
  maxCost: 1,
  currency: "compute-credit",
  allocationRule: "Reserva e ociosidade ao titular; uso e reparo ao movimento; partilha proporcional ao uso declarado.",
  reentry: "Fornecer a declaração ou evidência ausente, reduzir o custo, revisar a política ou abrir reexame situado.",
} as const;

const emptyBlindSpot: BlindSpotMap = { source: "", scope: "", errorDirection: "", unseenExchange: "", declaredAt: "" };

export const EMPTY_NOTEBOOK: CaseNotebook = {
  title: "", form: "maintained", expectedBehavior: "", observer: "", designation: "", horizon: "", host: "",
  currency: POLICY.currency, currencyUnit: "unidade declarada", measurementStatus: "measured", exchange: "", scale: "", reflux: "",
  separatingObservation: "", observationMode: "none", blindSpot: emptyBlindSpot,
};

const requiredDeclarations: Array<[keyof CaseNotebook, string]> = [
  ["title", "nome do caso"], ["expectedBehavior", "comportamento previsto"], ["observer", "observador e instrumento"],
  ["designation", "nomeação"], ["horizon", "horizonte"], ["host", "hospedeiro"], ["currency", "moeda"],
  ["currencyUnit", "unidade da moeda"], ["exchange", "troca"], ["scale", "escala"], ["reflux", "refluxo"],
];

export function missingNotebookDeclarations(notebook: CaseNotebook) {
  const basic = requiredDeclarations.filter(([key]) => !String(notebook[key]).trim()).map(([, label]) => label);
  if (notebook.measurementStatus !== "proxy") return basic;
  const proxyFields: Array<[keyof BlindSpotMap, string]> = [
    ["source", "fonte do proxy"], ["scope", "recorte do proxy"], ["errorDirection", "direção de erro"],
    ["unseenExchange", "troca não vista"], ["declaredAt", "data do mapa de cegueira"],
  ];
  return [...basic, ...proxyFields.filter(([key]) => !notebook.blindSpot[key].trim()).map(([, label]) => label)];
}

export function blindSpotIsPriorToEvent(notebook: CaseNotebook, eventTime: string) {
  if (notebook.measurementStatus !== "proxy") return true;
  const declaredAt = Date.parse(notebook.blindSpot.declaredAt);
  const eventAt = Date.parse(eventTime);
  return Number.isFinite(declaredAt) && Number.isFinite(eventAt) && declaredAt < eventAt;
}

export function declaredEvidence(labels: string[]): EvidenceRecord[] {
  const recordedAt = new Date().toISOString();
  return labels.map((label) => ({ id: `declared:${label}`, kind: "declared", label, recordedAt }));
}

function scenarioNotebook(title: string, measurementStatus: MeasurementStatus, observationMode: ObservationMode): CaseNotebook {
  return {
    title, form: "maintained", expectedBehavior: "A versão publicada deixa de receber manutenção se o fluxo de evidências e execução cessar.",
    observer: "Pessoa que mantém a edição e o registro de build no navegador.", designation: "Publicação estática com razão de decisões local.",
    horizon: "Uma execução de publicação e seu reexame declarado.", host: "Caderno local da edição digital.",
    currency: POLICY.currency, currencyUnit: "compute-credit", measurementStatus,
    exchange: "O caderno recebe evidências de versão e entrega uma decisão registrável.", scale: "Uma versão do site, lida na escala de uma sessão local.",
    reflux: "Sem novas evidências e execuções, a versão retorna a rascunho ou requer novo reexame.",
    separatingObservation: "O conjunto de evidências e o custo declarados antes da execução podem ser conferidos contra a política fixada.",
    observationMode,
    blindSpot: measurementStatus === "proxy"
      ? { source: "Registro de execução local", scope: "Uma versão e sua sessão de publicação", errorDirection: "Pode subestimar custo externo não declarado", unseenExchange: "Trabalho e infraestrutura fora do caderno local", declaredAt: "2026-08-27T11:59:00Z" }
      : { ...emptyBlindSpot },
  };
}

function scenarioEvent(id: string, title: string, evidence: string[], costVector: CostVector, measurementStatus: MeasurementStatus, observationMode: ObservationMode): MovementEvent {
  return {
    id, source: "urn:gdm:site:lab", type: POLICY.allowedType, subject: "site:gramatica-do-movimento", time: "2026-08-27T12:00:00Z",
    evidence, evidenceEnvelope: declaredEvidence(evidence), costVector, notebook: scenarioNotebook(title, measurementStatus, observationMode),
  };
}

export const SCENARIOS: Record<ScenarioKey, { label: string; premise: string; event: MovementEvent }> = {
  accepted: { label: "Publicar versão", premise: "Evidências completas e custo dentro do limite.", event: scenarioEvent("urn:gdm:browser:accepted-001", "Publicar uma versão", ["commit", "lockfile", "build"], { reservation: 0.1, usage: 0.42, shared: 0.08, idle: 0.02, repair: 0 }, "measured", "number") },
  denied: { label: "Reter custo excessivo", premise: "Evidências completas, mas custo acima do limite.", event: scenarioEvent("urn:gdm:browser:denied-002", "Reter um custo excessivo", ["commit", "lockfile", "build"], { reservation: 0.4, usage: 0.8, shared: 0.35, idle: 0.12, repair: 0.08 }, "measured", "number") },
  indeterminate: { label: "Aguardar prova ausente", premise: "Falta evidência; a regra ainda não decide.", event: scenarioEvent("urn:gdm:browser:indeterminate-003", "Aguardar prova ausente", ["commit", "build"], { reservation: 0.1, usage: 0.25, shared: 0.05, idle: 0, repair: 0.1 }, "proxy", "contour") },
};

function normalizeForDigest(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(normalizeForDigest);
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value as Record<string, unknown>).sort(([left], [right]) => left.localeCompare(right)).map(([key, child]) => [key, normalizeForDigest(child)]));
  return value;
}

function canonical(value: unknown) { return JSON.stringify(normalizeForDigest(value)); }

export async function digest(value: unknown) {
  const bytes = new TextEncoder().encode(canonical(value));
  const hash = await crypto.subtle.digest("SHA-256", bytes);
  return `sha256:${Array.from(new Uint8Array(hash)).map((byte) => byte.toString(16).padStart(2, "0")).join("")}`;
}

export async function digestFile(file: Blob) {
  const hash = await crypto.subtle.digest("SHA-256", await file.arrayBuffer());
  return `sha256:${Array.from(new Uint8Array(hash)).map((byte) => byte.toString(16).padStart(2, "0")).join("")}`;
}

export function deriveRank(notebook: CaseNotebook): DerivationStatus {
  if (notebook.measurementStatus === "metaphor") return { rank: "ordering", label: DERIVATION_LABELS.ordering, reason: "A moeda foi declarada como metáfora controlada; o caso ordena posições, mas não sustenta previsão." };
  if (notebook.observationMode === "none" || !notebook.separatingObservation.trim()) return { rank: "illustration", label: DERIVATION_LABELS.illustration, reason: "Sem observação separadora declarada antes da execução, o caso mostra o instrumento, mas não sobe a derivação." };
  const missingProxyMap = missingNotebookDeclarations(notebook).some((field) => ["fonte do proxy", "recorte do proxy", "direção de erro", "troca não vista", "data do mapa de cegueira"].includes(field));
  if (notebook.measurementStatus === "proxy" && missingProxyMap) return { rank: "ordering", label: DERIVATION_LABELS.ordering, reason: "O proxy não trouxe mapa de cegueira completo e datado; o caso não sobe a previsão por contorno." };
  if (notebook.measurementStatus === "proxy" || notebook.observationMode === "contour") return { rank: "prediction-contour", label: DERIVATION_LABELS["prediction-contour"], reason: "Há proxy ou observação por contorno declarados; a previsão permanece abaixo da previsão por número." };
  return { rank: "prediction-number", label: DERIVATION_LABELS["prediction-number"], reason: "A moeda é declarada como mensurável e a observação separadora fixa um número antes do resultado." };
}

export async function evaluate(event: MovementEvent): Promise<MovementDecision> {
  const missingEvidence = POLICY.requiredEvidence.filter((item) => !event.evidence.includes(item));
  const missingDeclarations = missingNotebookDeclarations(event.notebook);
  const proxyMapIsLate = !blindSpotIsPriorToEvent(event.notebook, event.time);
  const total = Object.values(event.costVector).reduce((sum, value) => sum + value, 0);
  const reasons: string[] = [];
  let state: DecisionState = "accept";
  if (!event.id || !event.source || !event.type || !event.time || missingEvidence.length || missingDeclarations.length || proxyMapIsLate) {
    state = "indeterminate";
    if (missingEvidence.length) reasons.push("EVIDENCE_INCOMPLETE");
    if (missingDeclarations.length) reasons.push("NOTEBOOK_INCOMPLETE");
    if (proxyMapIsLate) reasons.push("BLIND_SPOT_DECLARED_AFTER_EVENT");
    if (!missingEvidence.length && !missingDeclarations.length) reasons.push("EVENT_CONTEXT_INCOMPLETE");
  } else if (event.type !== POLICY.allowedType) { state = "deny"; reasons.push("EVENT_TYPE_NOT_ALLOWED");
  } else if (total > POLICY.maxCost) { state = "deny"; reasons.push("COST_LIMIT_EXCEEDED"); }
  const policyDigest = await digest(POLICY);
  return {
    id: `${event.id}:decision`, event: { id: event.id, source: event.source, subject: event.subject, time: event.time, type: event.type }, notebook: event.notebook,
    state, reasonCodes: reasons, missingEvidence, missingDeclarations, evidenceEnvelope: event.evidenceEnvelope,
    policy: { id: POLICY.id, version: POLICY.version, digest: policyDigest },
    cost: { ...event.costVector, total: Number(total.toFixed(2)), currency: event.notebook.currency, allocationRule: POLICY.allocationRule },
    derivation: proxyMapIsLate
      ? { rank: "ordering", label: DERIVATION_LABELS.ordering, reason: "O mapa de cegueira foi datado depois do evento; um limite posterior não protege a derivação." }
      : deriveRank(event.notebook),
    reviewAfter: state === "accept" ? null : "reexame definido pela política situada", reentry: POLICY.reentry, evaluatedAt: new Date().toISOString(), branchId: "tronco",
  };
}

export async function createLedgerEntry(decision: MovementDecision, previous: LedgerEntry | undefined, branchId = decision.branchId): Promise<LedgerEntry> {
  const payload = { sequence: previous ? previous.sequence + 1 : 1, previousHash: previous?.entryHash ?? "sha256:genesis", decisionId: decision.id, decisionDigest: await digest(decision), state: decision.state, derivationRank: decision.derivation.rank, recordedAt: new Date().toISOString(), branchId };
  return { ...payload, entryHash: await digest(payload) };
}

const rankOrder: DerivationRank[] = ["prediction-number", "prediction-contour", "ordering", "illustration"];

export function createReexamination(decision: MovementDecision, verdict: LeakVerdict, observation: string): Reexamination {
  const priorRank = decision.derivation.rank;
  const lowerRank = rankOrder[Math.min(rankOrder.indexOf(priorRank) + 1, rankOrder.length - 1)];
  const outcome: Record<LeakVerdict, { nextRank: Reexamination["nextRank"]; consequence: string }> = {
    "application-artifact": { nextRank: null, consequence: "Artefato de aplicação: o registro pede correção, mas a cláusula não se move." },
    "empirical-limit": { nextRank: lowerRank, consequence: "Limite da gramática empírica: o ponto cego foi declarado antes; a derivação desce um posto." },
    "clause-failure": { nextRank: "revogado", consequence: "Falha da cláusula: o vazamento persiste fora do ponto cego declarado; a derivação não se preserva por remendo." },
    "exchange-shift": { nextRank: null, consequence: "Deslocamento da troca: a descrição precisa ser corrigida; a decisão anterior permanece registrada para reexame situado." },
  };
  return { id: `urn:gdm:browser:reexamination-${crypto.randomUUID()}`, decisionId: decision.id, observation, verdict, recordedAt: new Date().toISOString(), priorRank, ...outcome[verdict] };
}

export function buildTrajectory(decisions: MovementDecision[], reexaminations: Reexamination[]): TrajectoryStep[] {
  return decisions.map((decision) => ({
    decisionId: decision.id,
    recordedAt: decision.evaluatedAt,
    form: decision.notebook.form,
    currency: decision.cost.currency,
    decision: decision.state,
    rank: decision.derivation.rank,
    ruptures: reexaminations.filter((item) => item.decisionId === decision.id).map((item) => item.verdict),
    branchId: decision.branchId,
  }));
}

export function filterTrajectoryByBranch(trajectory: TrajectoryStep[], branchId: string | "all") {
  return branchId === "all" ? trajectory : trajectory.filter((step) => step.branchId === branchId);
}

export function createTrajectoryExport(steps: TrajectoryStep[], branchId: string | "all", label: string, source: string): TrajectoryExport {
  return {
    _type: "org.gramatica.local-trajectory-export/v1",
    generatedAt: new Date().toISOString(),
    scope: "Recorte local de uma trajetória declarada. A exportação não altera a razão de origem, não verifica identidade e não estabelece equivalência entre moedas.",
    branch: { id: branchId, label, source },
    steps,
    limits: ["As posições preservam seu ramo e sua moeda declarados.", "O recorte não substitui a razão completa de origem.", "Não há conversão ou soma entre moedas distintas."],
  };
}

export function createTrajectoryBranch(source: LedgerEntry, reason: string, label?: string): TrajectoryBranch {
  return {
    id: `ramo-${crypto.randomUUID()}`,
    label: label?.trim() || `ramo a partir da posição ${source.sequence}`,
    sourceDecisionId: source.decisionId,
    sourceLedgerHash: source.entryHash,
    sourcePosition: source.sequence,
    reason: reason.trim() || "Nova hipótese declarada sem reescrever a trajetória de origem.",
    openedAt: new Date().toISOString(),
  };
}

export function archiveTrajectoryBranch(branch: TrajectoryBranch, reason: string): TrajectoryBranch {
  const archivedAt = new Date().toISOString();
  const archiveReason = reason.trim() || "Ramo encerrado pela pessoa que o abriu; suas posições permanecem legíveis.";
  return { ...branch, archivedAt, archiveReason, archiveHistory: [...(branch.archiveHistory ?? []), { archivedAt, reason: archiveReason }], reopenedAt: undefined, reopenReason: undefined };
}

export function branchIsArchived(branch: TrajectoryBranch | undefined) {
  return Boolean(branch?.archivedAt);
}

export function reopenTrajectoryBranch(branch: TrajectoryBranch, reason: string): TrajectoryBranch {
  if (!branch.archivedAt) return branch;
  const reopenedAt = new Date().toISOString();
  const reopenReason = reason.trim() || "Ramo reaberto para nova decisão situada, sem apagar o encerramento anterior.";
  const archiveHistory = [...(branch.archiveHistory ?? [{ archivedAt: branch.archivedAt, reason: branch.archiveReason ?? "Motivo não declarado." }])];
  const last = archiveHistory.at(-1);
  if (last && !last.reopenedAt) archiveHistory[archiveHistory.length - 1] = { ...last, reopenedAt, reopenReason };
  return { ...branch, archivedAt: undefined, archiveReason: undefined, archiveHistory, reopenedAt, reopenReason };
}

export function createDivergenceComment(difference: AttestationComparison["differences"][number], text: string): DivergenceComment {
  return { id: `urn:gdm:browser:divergence-comment-${crypto.randomUUID()}`, field: difference.field, local: difference.local, imported: difference.imported, text: text.trim(), recordedAt: new Date().toISOString() };
}

export function filterDivergences(differences: AttestationComparison["differences"], selection: "all" | "divergent" | string) {
  if (selection === "all") return differences;
  if (selection === "divergent") return differences.filter((difference) => difference.equal === false);
  return differences.filter((difference) => difference.field === selection);
}

export function createAttestationIndexEntry(decision: MovementDecision, ledger: LedgerEntry[], generatedAt: string): AttestationIndexEntry {
  return {
    id: `urn:gdm:browser:attestation-index-${crypto.randomUUID()}`,
    generatedAt,
    decisionId: decision.id,
    branchId: decision.branchId,
    state: decision.state,
    rank: decision.derivation.rank,
    policyDigest: decision.policy.digest,
    ledgerHead: ledger.at(-1)?.entryHash ?? "sha256:genesis",
  };
}

export function createReexaminationDeadline(decision: MovementDecision, dueAt: string, note: string): ReexaminationDeadline {
  return { id: `urn:gdm:browser:deadline-${crypto.randomUUID()}`, decisionId: decision.id, dueAt, declaredAt: new Date().toISOString(), note: note.trim() || "Reexame situado previsto antes do vencimento declarado." };
}

export function reexaminationDeadlineStatus(deadline: ReexaminationDeadline, reexaminations: Reexamination[], now = new Date()): "pending" | "reexamined" | "expired" {
  const hasReexamination = reexaminations.some((reexamination) => reexamination.decisionId === deadline.decisionId && reexamination.recordedAt >= deadline.declaredAt);
  if (hasReexamination) return "reexamined";
  return Date.parse(deadline.dueAt) < now.getTime() ? "expired" : "pending";
}

function recordValue(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : null;
}

export function inspectImportedAttestation(value: unknown): ImportedAttestation {
  const root = recordValue(value);
  if (!root) return { valid: false, type: null, generatedAt: null, policyDigest: null, ledgerHead: null, ledgerEntries: null, scope: null, decisionState: null, derivationRank: null, form: null, currency: null, issues: ["O arquivo não contém um objeto JSON de atestação."] };
  const predicate = recordValue(root.predicate);
  const policy = recordValue(predicate?.policy);
  const ledger = recordValue(predicate?.ledger);
  const decision = recordValue(predicate?.decision);
  const derivation = recordValue(predicate?.derivation);
  const notebook = recordValue(predicate?.notebook);
  const issues: string[] = [];
  if (typeof root._type !== "string" || !root._type.startsWith("org.gramatica.browser-attestation/")) issues.push("Tipo de atestação não reconhecido.");
  if (!predicate) issues.push("Predicado de decisão ausente.");
  if (typeof policy?.digest !== "string") issues.push("Digest de política ausente.");
  if (typeof ledger?.head !== "string" || typeof ledger?.entries !== "number") issues.push("Cabeça ou extensão da razão ausente.");
  return {
    valid: issues.length === 0,
    type: typeof root._type === "string" ? root._type : null,
    generatedAt: typeof root.generatedAt === "string" ? root.generatedAt : null,
    policyDigest: typeof policy?.digest === "string" ? policy.digest : null,
    ledgerHead: typeof ledger?.head === "string" ? ledger.head : null,
    ledgerEntries: typeof ledger?.entries === "number" ? ledger.entries : null,
    scope: typeof root.scope === "string" ? root.scope : null,
    decisionState: decision?.state === "accept" || decision?.state === "deny" || decision?.state === "indeterminate" ? decision.state : null,
    derivationRank: derivation?.rank === "prediction-number" || derivation?.rank === "prediction-contour" || derivation?.rank === "ordering" || derivation?.rank === "illustration" ? derivation.rank : null,
    form: notebook?.form === "event" || notebook?.form === "equilibrium" || notebook?.form === "maintained" ? notebook.form : null,
    currency: typeof notebook?.currency === "string" ? notebook.currency : null,
    issues,
  };
}

export function compareImportedAttestation(decision: MovementDecision | null, ledger: LedgerEntry[], imported: ImportedAttestation | null): AttestationComparison {
  if (!imported) return { ready: false, samePolicy: null, sameLedgerHead: null, notes: ["Selecione um pacote para iniciar o confronto local."], differences: [] };
  if (!imported.valid) return { ready: false, samePolicy: null, sameLedgerHead: null, notes: imported.issues, differences: [] };
  if (!decision) return { ready: false, samePolicy: null, sameLedgerHead: null, notes: ["Execute uma decisão local antes de confrontar outro pacote."], differences: [] };
  const samePolicy = imported.policyDigest === decision.policy.digest;
  const sameLedgerHead = imported.ledgerHead === (ledger.at(-1)?.entryHash ?? "sha256:genesis");
  const differences = [
    { field: "política", local: decision.policy.digest, imported: imported.policyDigest ?? "não declarada", equal: samePolicy },
    { field: "razão", local: ledger.at(-1)?.entryHash ?? "sha256:genesis", imported: imported.ledgerHead ?? "não declarada", equal: sameLedgerHead },
    { field: "decisão", local: decision.state, imported: imported.decisionState ?? "não declarada", equal: imported.decisionState ? imported.decisionState === decision.state : null },
    { field: "posto", local: decision.derivation.rank, imported: imported.derivationRank ?? "não declarado", equal: imported.derivationRank ? imported.derivationRank === decision.derivation.rank : null },
    { field: "moeda", local: decision.cost.currency, imported: imported.currency ?? "não declarada", equal: imported.currency ? imported.currency === decision.cost.currency : null },
  ];
  return {
    ready: true,
    samePolicy,
    sameLedgerHead,
    notes: [
      samePolicy ? "As duas sessões declaram a mesma política digestada." : "As políticas divergem; os resultados não devem ser somados nem tratados como equivalentes.",
      sameLedgerHead ? "As razões têm a mesma cabeça declarada." : "As razões têm cabeças distintas; o pacote importado marca outra trajetória, não uma prova da sessão local.",
    ],
    differences,
  };
}

export function createDivergenceReport(decision: MovementDecision, ledger: LedgerEntry[], imported: ImportedAttestation, comparison: AttestationComparison, comments: DivergenceComment[] = []): DivergenceReport {
  return {
    _type: "org.gramatica.local-divergence-report/v1",
    generatedAt: new Date().toISOString(),
    scope: "Relatório local de diferenças declaradas entre uma sessão deste navegador e metadados de uma atestação escolhida localmente. Não verifica identidade, não absorve o pacote externo como prova e não estabelece equivalência entre moedas.",
    local: { decisionId: decision.id, policyDigest: decision.policy.digest, ledgerHead: ledger.at(-1)?.entryHash ?? "sha256:genesis" },
    imported: { type: imported.type, generatedAt: imported.generatedAt, scope: imported.scope },
    fields: comparison.differences,
    comments,
    limits: ["O confronto opera apenas sobre metadados declarados.", "Uma divergência não hierarquiza aplicadores nem decide qual trajetória é verdadeira.", "Moedas, escopos e razões distintas não são somados ou convertidos."],
  };
}

export async function createAttestation(decision: MovementDecision, ledger: LedgerEntry[], reexaminations: Reexamination[] = [], deadlines: ReexaminationDeadline[] = []) {
  const subjectDigest = await digest(decision);
  return {
    _type: "org.gramatica.browser-attestation/v3", generatedAt: new Date().toISOString(),
    scope: "Atestação local em memória do navegador. Registra caso, evidências por metadado e digest, política, decisão, posto, reexames e razão desta sessão; não é assinatura de identidade, procedência remota ou auditoria externa.",
    subject: { name: decision.id, digest: subjectDigest },
    predicate: {
      policy: decision.policy, decision: { state: decision.state, reasonCodes: decision.reasonCodes, digest: subjectDigest, branchId: decision.branchId }, derivation: decision.derivation,
      notebook: { form: decision.notebook.form, host: decision.notebook.host, currency: decision.notebook.currency, measurementStatus: decision.notebook.measurementStatus, blindSpot: decision.notebook.blindSpot },
      evidence: decision.evidenceEnvelope, cost: decision.cost, ledger: { entries: ledger.length, head: ledger.at(-1)?.entryHash ?? "sha256:genesis" }, reexaminations, deadlines,
    },
  };
}
