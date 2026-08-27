/*
 * Caderno de Margem: chave transversal de leitura. Contornos não totalizam objetos;
 * apenas recortam posições comparáveis. Linhas abertas mantêm visível a exterioridade.
 */
import { EditorialMark } from "@/components/EditorialMark";

type RepresentationKeyProps = {
  className?: string;
  compact?: boolean;
};

const entries = [
  {
    type: "closed",
    label: "CONTORNO FECHADO",
    text: "posição ou recorte comparável; a figura não esgota a coisa.",
  },
  {
    type: "relation",
    label: "LINHA FIRME",
    text: "relação declarada entre posições, sem converter passagem possível em ocorrência.",
  },
  {
    type: "open",
    label: "TRAÇO ABERTO",
    text: "suporte, gesto, custo ou revisão que atravessa a forma sem caber nela.",
  },
  {
    type: "horizon",
    label: "ARCO INTERROMPIDO",
    text: "campo ou horizonte que condiciona a leitura sem receber uma borda total.",
  },
] as const;

function KeyMark({ type }: { type: (typeof entries)[number]["type"] }) {
  return (
    <svg className={`representation-key-mark representation-key-${type}`} viewBox="0 0 74 26" aria-hidden="true">
      {type === "closed" && <path d="M16 4h36v18H16z" />}
      {type === "relation" && <><circle cx="16" cy="13" r="4" /><path d="M24 13h28" /><circle cx="58" cy="13" r="4" /></>}
      {type === "open" && <path d="M12 19c11-16 22 5 34-9 5-6 9-7 16-5" />}
      {type === "horizon" && <path d="M10 19c14-17 36-17 54 0" />}
    </svg>
  );
}

export function RepresentationKey({ className = "", compact = false }: RepresentationKeyProps) {
  return (
    <aside className={`representation-key ${compact ? "is-compact" : ""} ${className}`.trim()} aria-label="Chave de representação">
      <div className="representation-key-heading"><EditorialMark /><span>CHAVE DE LEITURA</span><i aria-hidden="true" /></div>
      <ul>
        {entries.map((entry) => (
          <li key={entry.type}>
            <KeyMark type={entry.type} />
            <p><strong>{entry.label}</strong>{entry.text}</p>
          </li>
        ))}
      </ul>
    </aside>
  );
}
