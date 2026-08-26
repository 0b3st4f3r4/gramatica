/**
 * Caderno de Margem: renderer de diagrama estrutural, discreto e legível em fundo branco.
 */
import { useEffect, useId, useState } from "react";

type MermaidApi = typeof import("mermaid").default;

type MermaidDiagramProps = {
  chart: string;
};

let mermaidConfigured = false;

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

export function MermaidDiagram({ chart }: MermaidDiagramProps) {
  const rawId = useId();
  const diagramId = `diagrama-${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const [svg, setSvg] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function renderChart() {
      try {
        const { default: mermaid } = await import("mermaid");
        configureMermaid(mermaid);
        const result = await mermaid.render(diagramId, chart);
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
      <figcaption>Diagrama estrutural do manuscrito.</figcaption>
    </figure>
  );
}
