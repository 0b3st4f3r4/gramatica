/**
 * Caderno de Margem: memória opt-in do laboratório. Nada é salvo sem uma ação
 * explícita; arquivos, conteúdo de arquivos, pacotes importados e credenciais
 * não pertencem ao instantâneo persistido.
 */
import type { CurrencyWallet, DivergenceComment, LedgerEntry, MovementDecision, Reexamination, ReexaminationDeadline, TrajectoryBranch } from "./rmv";

export const LAB_HISTORY_KEY = "gdm:lab-history:v1";

export type LocalLabHistory = {
  version: 1;
  savedAt: string;
  scope: "histórico local escolhido pela pessoa nesta origem do navegador";
  decisions: MovementDecision[];
  ledger: LedgerEntry[];
  reexaminations: Reexamination[];
  deadlines: ReexaminationDeadline[];
  divergenceComments: DivergenceComment[];
  wallets: CurrencyWallet[];
  branches: TrajectoryBranch[];
};

type StorageLike = Pick<Storage, "getItem" | "setItem" | "removeItem">;

function permittedEvidence(decision: MovementDecision): MovementDecision {
  return {
    ...decision,
    evidenceEnvelope: decision.evidenceEnvelope.map((record) => ({
      id: record.id,
      kind: record.kind,
      label: record.label,
      recordedAt: record.recordedAt,
      ...(record.digest ? { digest: record.digest } : {}),
      ...(record.file ? { file: { ...record.file } } : {}),
    })),
  };
}

export function createLocalLabHistory(
  decisions: MovementDecision[],
  ledger: LedgerEntry[],
  reexaminations: Reexamination[],
  deadlines: ReexaminationDeadline[],
  divergenceComments: DivergenceComment[],
  wallets: CurrencyWallet[],
  branches: TrajectoryBranch[],
): LocalLabHistory {
  return {
    version: 1,
    savedAt: new Date().toISOString(),
    scope: "histórico local escolhido pela pessoa nesta origem do navegador",
    decisions: decisions.map(permittedEvidence),
    ledger: ledger.map((entry) => ({ ...entry })),
    reexaminations: reexaminations.map((entry) => ({ ...entry })),
    deadlines: deadlines.map((entry) => ({ ...entry })),
    divergenceComments: divergenceComments.map((entry) => ({ ...entry })),
    wallets: wallets.map((wallet) => ({ ...wallet })),
    branches: branches.map((branch) => ({ ...branch })),
  };
}

function isHistory(value: unknown): value is LocalLabHistory {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const candidate = value as Record<string, unknown>;
  return candidate.version === 1 && typeof candidate.savedAt === "string" && Array.isArray(candidate.decisions) && Array.isArray(candidate.ledger) && Array.isArray(candidate.reexaminations) && Array.isArray(candidate.wallets) && Array.isArray(candidate.branches);
}

export function saveLocalLabHistory(snapshot: LocalLabHistory, storage: StorageLike = window.localStorage): boolean {
  try {
    storage.setItem(LAB_HISTORY_KEY, JSON.stringify(snapshot));
    return true;
  } catch {
    return false;
  }
}

export function loadLocalLabHistory(storage: StorageLike = window.localStorage): LocalLabHistory | null {
  try {
    const raw = storage.getItem(LAB_HISTORY_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return isHistory(parsed) ? {
      ...parsed,
      deadlines: Array.isArray((parsed as Record<string, unknown>).deadlines) ? (parsed as LocalLabHistory).deadlines : [],
      divergenceComments: Array.isArray((parsed as Record<string, unknown>).divergenceComments) ? (parsed as LocalLabHistory).divergenceComments : [],
    } : null;
  } catch {
    return null;
  }
}

export function clearLocalLabHistory(storage: StorageLike = window.localStorage): boolean {
  try {
    storage.removeItem(LAB_HISTORY_KEY);
    return true;
  } catch {
    return false;
  }
}
