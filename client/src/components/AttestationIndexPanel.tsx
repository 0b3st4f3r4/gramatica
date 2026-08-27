/**
 * Caderno de Margem: índice efêmero de atestações criadas nesta aba.
 * Não lê armazenamento local nem retém arquivos, credenciais ou pacotes externos.
 */
import { EditorialMark } from "@/components/EditorialMark";
import { DERIVATION_LABELS, type AttestationIndexEntry } from "@/lib/rmv";

type Props = { entries: AttestationIndexEntry[] };

const stateLabels = { accept: "ADMITIDO", deny: "RETIDO", indeterminate: "EM ABERTO" } as const;

export function AttestationIndexPanel({ entries }: Props) {
  return (
    <section className="rmv-attestation-index" aria-labelledby="attestation-index-title">
      <div>
        <span className="rmv-field-label">ÍNDICE DA SESSÃO</span>
        <h3 id="attestation-index-title">Atestações geradas nesta aba.</h3>
        <p>O índice dura até a limpeza ou a recarga da sessão. Ele não guarda o arquivo exportado nem cria histórico local.</p>
      </div>
      {entries.length ? <ol>{entries.map((entry, index) => <li key={entry.id}><span>{String(index + 1).padStart(2, "0")}</span><EditorialMark className="rmv-index-mark" /><div><strong>{stateLabels[entry.state]} · {DERIVATION_LABELS[entry.rank]}</strong><small>{entry.branchId === "tronco" ? "tronco" : entry.branchId} · {new Date(entry.generatedAt).toLocaleString("pt-BR")}</small></div><em>{entry.ledgerHead.replace("sha256:", "").slice(0, 12)}…</em></li>)}</ol> : <p className="rmv-empty">Nenhuma atestação foi gerada nesta sessão.</p>}
    </section>
  );
}
