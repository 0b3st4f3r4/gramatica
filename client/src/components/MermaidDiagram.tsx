/**
 * Caderno de Margem: renderer de diagrama estrutural. Cada figura mostra relações abstratas
 * e declara, em legenda, as condições materiais, situadas ou temporais que ficam fora do quadro.
 */
import { memo, useEffect, useId, useState } from "react";

type MermaidApi = typeof import("mermaid").default;

type MermaidDiagramProps = {
  chart: string;
};

let mermaidConfigured = false;
const renderedSvgCache = new Map<string, string>();

type DiagramScope = {
  label: string;
  relation: string;
  outside: string;
};

function diagramScope(chart: string): DiagramScope {
  if (chart.includes("<b>EVENTO</b>")) {
    return {
      label: "FIGURA 01 · TIPOLOGIA",
      relation: "A figura organiza três comportamentos previstos: propagação, equilíbrio e manutenção contra o fluxo.",
      outside: "A matéria de cada caso, a energia que o sustenta e o domínio físico-químico da comparação seguem declarados no texto e na Tabela 1.",
    };
  }

  if (chart.includes("A gramática") && chart.includes("Rivais")) {
    return {
      label: "FIGURA 02 · CARTOGRAFIA DE RIVAIS",
      relation: "Setas cheias registram recebimentos e acréscimos; setas tracejadas registram onde outro vocabulário segue melhor.",
      outside: "As obras, épocas, problemas e custos de cada aproximação não cabem na cartografia e permanecem nos parágrafos do referencial.",
    };
  }

  if (chart.includes("HOSPEDEIRO") && chart.includes("ESTRUTURA MANTIDA")) {
    return {
      label: "FIGURA 03 · PAGAMENTO E HOSPEDEIRO",
      relation: "O circuito relaciona hospedeiro, estrutura, moeda declarada e estatuto da medida antes da descrição.",
      outside: "A retirada efetiva da moeda, a observação separadora e o custo concreto exigem um caso situado; o diagrama não os substitui.",
    };
  }

  if (chart.includes("abdução") && chart.includes("retroalimentação")) {
    return {
      label: "FIGURA 04 · TOPOLOGIA DO CICLO",
      relation: "Nós e arestas mostram posições, movimentos e trajetórias admitidas pelo grafo pleno.",
      outside: "Uma passagem real exige suporte, nomeação, horizonte, moeda e registro; o grafo não presume que toda aresta ocorreu fora da notação.",
    };
  }

  if (chart.includes("Razão operante") && chart.includes("Carcaça legível")) {
    return {
      label: "FIGURA 05 · DEGRADAÇÃO DA RAZÃO",
      relation: "A sequência marca mudanças de estatuto entre razão, ressonância, cobrança e carcaça legível.",
      outside: "A data do vazamento, a contestação e o custo de responder ao que falhou pertencem ao registro concreto, não à escada.",
    };
  }

  return {
    label: "RELAÇÕES ABSTRATAS",
    relation: "O diagrama organiza posições e vínculos para leitura comparável.",
    outside: "Suporte, custo e situação permanecem declarados no texto e nas tabelas.",
  };
}

function configureMermaid(mermaid: MermaidApi) {
  if (mermaidConfigured) return;

  mermaid.initialize({
    startOnLoad: false,
    securityLevel: "strict",
    theme: "base",
    fontFamily: "IBM Plex Sans, Arial, sans-serif",
    flowchart: { htmlLabels: true, useMaxWidth: true },
    themeVariables: {
      background: "#fffefd",
      primaryColor: "#eef5f5",
      primaryBorderColor: "#0f4c5c",
      primaryTextColor: "#142126",
      lineColor: "#0f4c5c",
      secondaryColor: "#f7f4ee",
      tertiaryColor: "#ffffff",
      clusterBkg: "#fbfaf7",
      clusterBorder: "#c8d9d9",
      edgeLabelBackground: "#fffefd",
      fontSize: "14px",
    },
  });
  mermaidConfigured = true;
}

function MermaidDiagramComponent({ chart }: MermaidDiagramProps) {
  const rawId = useId();
  const diagramId = `diagrama-${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const [svg, setSvg] = useState(() => renderedSvgCache.get(chart) ?? "");
  const [error, setError] = useState(false);
  const scope = diagramScope(chart);

  useEffect(() => {
    let cancelled = false;

    async function renderChart() {
      try {
        const cachedSvg = renderedSvgCache.get(chart);
        if (cachedSvg) {
          if (!cancelled) {
            setSvg(cachedSvg);
            setError(false);
          }
          return;
        }

        const { default: mermaid } = await import("mermaid");
        configureMermaid(mermaid);
        const result = await mermaid.render(diagramId, chart);
        renderedSvgCache.set(chart, result.svg);
        if (!cancelled) {
          setSvg(result.svg);
          setError(false);
        }
      } catch {
        if (!cancelled) setError(true);
      }
    }

    void renderChart();
    return () => {
      cancelled = true;
    };
  }, [chart, diagramId]);

  return (
    <figure className="mermaid-figure" aria-label="Diagrama do manuscrito">
      <div className="mermaid-canvas" role="img" aria-label="Diagrama Mermaid renderizado">
        {error ? (
          <pre className="mermaid-fallback">{chart}</pre>
        ) : svg ? (
          <div dangerouslySetInnerHTML={{ __html: svg }} />
        ) : (
          <span className="mermaid-loading">Preparando diagrama…</span>
        )}
      </div>
      <figcaption>
        <span>{scope.label}</span>
        <p>{scope.relation}</p>
        <p className="mermaid-caption-limit"><strong>FORA DO QUADRO.</strong> {scope.outside}</p>
      </figcaption>
    </figure>
  );
}

export const MermaidDiagram = memo(
  MermaidDiagramComponent,
  (previous, next) => previous.chart === next.chart,
);
