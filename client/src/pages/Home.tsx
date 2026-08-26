/**
 * Caderno de Margem: página de leitura longa com margem de navegação e manuscrito como protagonista.
 */
import { isValidElement, useEffect, useMemo, useState, type ReactNode } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowUpRight, Check, Copy, Menu, MoveUpRight, X } from "lucide-react";
import manuscript from "@/content/gramatica-do-movimento.md?raw";
import { MermaidDiagram } from "@/components/MermaidDiagram";

const marcaUrl = "/manus-storage/gramatica-movimento-marca_9c9690fc.png";
const aberturaUrl = "/manus-storage/gramatica-movimento-abertura_477e34a2.png";
const arestaUrl = "/manus-storage/gramatica-movimento-aresta_859ee0ed.png";
const fechoUrl = "/manus-storage/gramatica-movimento-fecho_af736ff5.png";

type TocItem = {
  id: string;
  label: string;
  level: 2 | 3;
};

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function textFromChildren(children: ReactNode): string {
  if (typeof children === "string" || typeof children === "number") return String(children);
  if (Array.isArray(children)) return children.map(textFromChildren).join("");
  if (isValidElement<{ children?: ReactNode }>(children)) return textFromChildren(children.props.children);
  return "";
}

function Heading({ level, children }: { level: 2 | 3; children: ReactNode }) {
  const label = textFromChildren(children);
  const id = slugify(label);
  const Tag = level === 2 ? "h2" : "h3";

  return (
    <Tag id={id} className={`manuscript-heading heading-${level}`}>
      <a href={`#${id}`} className="heading-anchor" aria-label={`Link para ${label}`}>
        {children}
        <span aria-hidden="true">#</span>
      </a>
    </Tag>
  );
}

function ReadingMeta() {
  return (
    <div className="reading-meta" aria-label="Dados da edição">
      <span>30.032 palavras</span>
      <span>5 diagramas</span>
      <span>edição estática</span>
    </div>
  );
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeId, setActiveId] = useState("resumo");
  const [progress, setProgress] = useState(0);
  const [copied, setCopied] = useState(false);

  const content = useMemo(() => manuscript.replace(/^[\s\S]*?(?=## RESUMO)/, ""), []);
  const toc = useMemo<TocItem[]>(
    () =>
      Array.from(manuscript.matchAll(/^(#{2,3})\s+(.+)$/gm)).map((match) => ({
        level: match[1].length as 2 | 3,
        label: match[2],
        id: slugify(match[2]),
      })),
    [],
  );

  useEffect(() => {
    const headings = toc
      .map((item) => document.getElementById(item.id))
      .filter((heading): heading is HTMLElement => Boolean(heading));

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]?.target.id) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 },
    );

    headings.forEach((heading) => observer.observe(heading));
    return () => observer.disconnect();
  }, [toc]);

  useEffect(() => {
    function updateProgress() {
      const limit = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(limit > 0 ? Math.min(100, (window.scrollY / limit) * 100) : 0);
    }

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, []);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  const markdownComponents: Components = {
    h1: ({ children }) => <Heading level={2}>{children}</Heading>,
    h2: ({ children }) => <Heading level={2}>{children}</Heading>,
    h3: ({ children }) => <Heading level={3}>{children}</Heading>,
    pre: ({ children }) => <>{children}</>,
    code: ({ className, children }) => {
      const language = /language-(\w+)/.exec(className || "")?.[1];
      const value = String(children).replace(/\n$/, "");
      if (language === "mermaid") return <MermaidDiagram chart={value} />;
      if (!language) return <code className="inline-code">{children}</code>;
      return (
        <pre className="code-block">
          <code className={className}>{children}</code>
        </pre>
      );
    },
    table: ({ children }) => (
      <div className="table-scroll">
        <table>{children}</table>
      </div>
    ),
    blockquote: ({ children }) => <blockquote className="essay-quote">{children}</blockquote>,
    a: ({ href, children }) => (
      <a href={href} target={href?.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
        {children}
      </a>
    ),
  };

  return (
    <div className="editorial-shell">
      <div className="reading-progress" style={{ transform: `scaleX(${progress / 100})` }} />

      <header className="mobile-header">
        <a className="mobile-brand" href="#inicio" aria-label="Início de Gramática do Movimento">
          <img src={marcaUrl} alt="Marca abstrata de fluxo e retorno" />
          <span>GRAMÁTICA<br />DO MOVIMENTO</span>
        </a>
        <button
          className="icon-button"
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="indice-leitura"
          aria-label={menuOpen ? "Fechar índice" : "Abrir índice"}
        >
          {menuOpen ? <X size={19} /> : <Menu size={20} />}
        </button>
      </header>

      <aside id="indice-leitura" className={`reading-rail ${menuOpen ? "is-open" : ""}`}>
        <div className="rail-top">
          <a className="wordmark" href="#inicio" onClick={() => setMenuOpen(false)}>
            <img src={marcaUrl} alt="Marca abstrata de fluxo e retorno" />
            <span>GRAMÁTICA<br />DO MOVIMENTO</span>
          </a>
          <div className="rail-edition"><span>EDIÇÃO CRÍTICA</span><strong>2026</strong></div>
          <p className="rail-kicker">Caderno de leitura</p>
          <p className="rail-description">Uma gramática filosófica do movimento.</p>
        </div>

        <nav className="toc" aria-label="Índice do manuscrito">
          <span className="toc-label">ÍNDICE</span>
          <div className="toc-links">
            {toc.map((item) => (
              <a
                className={`toc-link toc-level-${item.level} ${activeId === item.id ? "is-active" : ""}`}
                href={`#${item.id}`}
                key={item.id}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
          </div>
        </nav>

        <div className="rail-bottom">
          <div className="progress-copy"><span>Leitura</span><strong>{Math.round(progress)}%</strong></div>
          <div className="progress-track"><span style={{ width: `${progress}%` }} /></div>
          <a className="source-link" href="#referencias" onClick={() => setMenuOpen(false)}>
            Referências <ArrowUpRight size={13} />
          </a>
        </div>
      </aside>

      {menuOpen && <button className="menu-scrim" type="button" onClick={() => setMenuOpen(false)} aria-label="Fechar índice" />}

      <main className="reading-stage">
        <section id="inicio" className="opening" aria-labelledby="page-title">
          <div className="opening-copy">
            <p className="eyebrow"><MoveUpRight size={15} /> EDIÇÃO DIGITAL · 2026</p>
            <div className="opening-folio"><span>01</span><i aria-hidden="true" /><span>CADERNO DE MARGEM</span></div>
            <h1 id="page-title">Gramática<br />do Movimento</h1>
            <p className="opening-deck">Um sistema de leitura para declarar aquilo que flui, aquilo que persiste e aquilo que se paga para sustentar uma forma.</p>
            <ReadingMeta />
            <div className="opening-actions">
              <a className="primary-link" href="#resumo">Começar a leitura <ArrowUpRight size={16} /></a>
              <button className="copy-link" type="button" onClick={copyLink}>
                {copied ? <Check size={15} /> : <Copy size={15} />}
                {copied ? "Link copiado" : "Copiar link"}
              </button>
            </div>
          </div>
          <img className="opening-image" src={aberturaUrl} alt="Linhas topológicas abstratas em azul-petróleo" />
        </section>

        <section className="reading-note" aria-label="Nota da edição">
          <img src={arestaUrl} alt="Trajetória abstrata com pontos de passagem" />
          <div>
            <span>LEITURA ABERTA</span>
            <p>O índice acompanha a posição de leitura; os diagramas permanecem vivos e redimensionáveis no próprio texto.</p>
          </div>
        </section>

        <article className="manuscript" aria-label="Manuscrito Gramática do Movimento">
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
            {content}
          </ReactMarkdown>
        </article>

        <footer className="closing" id="fecho">
          <img src={fechoUrl} alt="Mapa abstrato de pontos e linhas em azul-petróleo" />
          <div>
            <span>EDIÇÃO ESTÁTICA</span>
            <p>O texto permanece aberto à revisão; a página preserva sua estrutura, seus diagramas e sua navegabilidade.</p>
          </div>
          <a href="#inicio">Voltar ao início <ArrowUpRight size={15} /></a>
        </footer>
      </main>
    </div>
  );
}
