/**
 * Caderno de Margem: página de leitura longa com margem de navegação e manuscrito como protagonista.
 */
import { isValidElement, useEffect, useMemo, useState, type ReactNode } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { ArrowUpRight, Check, Copy, Download, Menu, X } from "lucide-react";
import manuscript from "@/content/gramatica-do-movimento.md?raw";
import { MermaidDiagram } from "@/components/MermaidDiagram";
import { EditorialMark } from "@/components/EditorialMark";

const bookPdfUrl = "https://raw.githubusercontent.com/0b3st4f3r4/gramatica/main/downloads/gramatica-do-movimento-livro.pdf";

type TocItem = {
  id: string;
  label: string;
  level: 2 | 3;
};

function EditorialTrace({ className = "" }: { className?: string }) {
  return (
    <svg className={`editorial-trace ${className}`} viewBox="0 0 640 340" preserveAspectRatio="xMaxYMid meet" aria-hidden="true">
      <path className="trace-light" d="M355 22c-22 38 9 57 45 64 48 9 95-5 123 24 23 24 7 57-34 76-54 25-80 69-58 110 24 44 113 28 122 98" />
      <path className="trace-main" d="M236 304c20-77 95-93 111-158 15-58-27-82 19-124 36-33 90-19 113-61" />
      <path className="trace-faint" d="M438 16c15 34 68 41 84 75 14 28-12 54-43 66m-28 95c38 21 86 25 104 62" />
      <circle cx="236" cy="304" r="5" className="trace-node" />
      <circle cx="347" cy="146" r="5" className="trace-node" />
      <circle cx="479" cy="61" r="5" className="trace-node" />
      <circle cx="553" cy="230" r="5" className="trace-node" />
    </svg>
  );
}

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

type TableScope = {
  label: string;
  relation: string;
  outside: string;
};

function tableScope(children: ReactNode): TableScope {
  const content = textFromChildren(children);

  if (content.includes("Comportamento previsto")) {
    return {
      label: "TABELA 01 · TIPOLOGIA",
      relation: "As colunas comparam comportamento previsto, manutenção e estatuto de cada família de forma.",
      outside: "A matéria, a escala e o custo concreto de cada ocorrência seguem fora da grade e exigem descrição situada.",
    };
  }

  if (content.includes("Hospedeiro") && content.includes("Mensurabilidade")) {
    return {
      label: "TABELA 02 · MOEDAS",
      relation: "A tabela mantém separadas as moedas por hospedeiro, elemento sustentado e estatuto de mensurabilidade.",
      outside: "A retirada observável, o proxy admitido e a conta paga por um caso não podem ser inferidos apenas da lista.",
    };
  }

  if (content.includes("Símbolo") && content.includes("Estado epistemológico")) {
    return {
      label: "TABELA 03 · NÓS",
      relation: "As linhas nomeiam posições do ciclo e os seus símbolos para leitura consistente da topologia.",
      outside: "O gesto que ocupa uma posição, sua duração e seu suporte permanecem no registro da aplicação.",
    };
  }

  if (content.includes("Operação") && content.includes("Transformação")) {
    return {
      label: "TABELA 04 · MOVIMENTOS",
      relation: "A tabela diferencia operações pela transformação de um nó em outro e pelo comportamento previsto da passagem.",
      outside: "Uma seta possível não comprova uma passagem ocorrida; data, material e custo pertencem ao caso que a declara.",
    };
  }

  if (content.includes("Forma") && content.includes("Veredito") && content.includes("Caso")) {
    return {
      label: "TABELA 05 · APLICAÇÕES",
      relation: "Os seis casos são comparados por forma, moeda, posto e veredito, sem reduzir essas colunas a uma medida comum.",
      outside: "As evidências, divergências e pagamentos de cada caso continuam nos trechos de aplicação e não se somam na tabela.",
    };
  }

  if (content.includes("Categoria") && content.includes("Consequência")) {
    return {
      label: "TABELA 06 · VAZAMENTOS",
      relation: "As linhas distinguem classes de vazamento e consequências para o estatuto de uma derivação.",
      outside: "O veredito exige razão datada, campo de contestação e caso identificado; a classe não resolve sozinha uma disputa.",
    };
  }

  if (content.includes("Tronco") && content.includes("Trajetória")) {
    return {
      label: "TABELA 07 · TRAJETÓRIAS",
      relation: "A enumeração agrupa as trinta e duas trajetórias admitidas pela topologia plena segundo seu tronco.",
      outside: "A tabela oferece espaço de possibilidades; não registra qual trajetória um caso real percorreu nem como foi custeada.",
    };
  }

  if (content.includes("de \\ para") && content.includes("a") && content.includes("c")) {
    return {
      label: "TABELA 08 · ADJACÊNCIA",
      relation: "A matriz mostra quais passagens de avanço e ciclo são admitidas entre os dez nós do grafo.",
      outside: "A adjacência não decide tempo, materialidade, recorrência ou validade de uma passagem realizada no mundo.",
    };
  }

  return {
    label: "TABELA · RECORTE COMPARATIVO",
    relation: "A grade organiza diferenças por colunas para tornar a comparação explícita.",
    outside: "As condições que fazem uma linha valer permanecem declaradas no texto, no caso e no registro correspondente.",
  };
}

function ManuscriptTable({ children }: { children: ReactNode }) {
  const scope = tableScope(children);

  return (
    <div className="table-scroll">
      <div className="table-register-label">{scope.label}</div>
      <table>{children}</table>
      <div className="table-scope" role="note">
        <p>{scope.relation}</p>
        <p><strong>FORA DA GRADE.</strong> {scope.outside}</p>
      </div>
    </div>
  );
}

function Heading({ level, children }: { level: 2 | 3; children: ReactNode }) {
  const label = textFromChildren(children);
  const id = slugify(label);
  const Tag = level === 2 ? "h2" : "h3";
  const sectionNumber = label.match(/^(\d+)/)?.[1];
  const sectionMeta = sectionNumber ? `SEÇÃO ${sectionNumber}` : "ABERTURA";

  return (
    <Tag id={id} className={`manuscript-heading heading-${level}`}>
      <a href={`#${id}`} className="heading-anchor" aria-label={`Link para ${label}`}>
        {level === 2 && <span className="heading-meta" aria-hidden="true">{sectionMeta}</span>}
        {level === 2 && <EditorialMark className="heading-mark" aria-hidden="true" />}
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
  const activeLabel = toc.find((item) => item.id === activeId)?.label ?? "RESUMO";

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

  const markdownComponents = useMemo<Components>(
    () => ({
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
      table: ({ children }) => <ManuscriptTable>{children}</ManuscriptTable>,
      blockquote: ({ children }) => <blockquote className="essay-quote">{children}</blockquote>,
      a: ({ href, children }) => (
        <a href={href} target={href?.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
          {children}
        </a>
      ),
    }),
    [],
  );

  return (
    <div className="editorial-shell">
      <div className="reading-progress" style={{ transform: `scaleX(${progress / 100})` }} />

      <header className="mobile-header">
        <a className="mobile-brand" href="#inicio" aria-label="Início de Gramática do Movimento">
          <EditorialMark />
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
            <EditorialMark />
            <span>GRAMÁTICA<br />DO MOVIMENTO</span>
          </a>
          <div className="rail-edition"><span>EDIÇÃO CRÍTICA</span><strong>2026</strong></div>
          <div className="rail-document"><span>DOCUMENTO 01</span><span>LEITURA · WEB</span></div>
          <p className="rail-kicker">Caderno de leitura</p>
          <p className="rail-description">Uma gramática filosófica do movimento.</p>
          <div className="rail-position"><span>POSIÇÃO EM CURSO</span><strong>{activeLabel}</strong></div>
          <div className="rail-instrument" aria-label="Aparelho de leitura">
            <span>FÓLIO 01</span>
            <i aria-hidden="true" />
            <strong>{Math.round(progress)}%</strong>
          </div>
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
          <div className="progress-copy"><span>PROGRESSO DE LEITURA</span><strong>{Math.round(progress)}%</strong></div>
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
            <p className="eyebrow"><EditorialMark className="opening-mark" /> EDIÇÃO DIGITAL · 2026</p>
            <div className="opening-folio"><span>01</span><i aria-hidden="true" /><span>CADERNO DE MARGEM</span></div>
            <h1 id="page-title">Gramática<br />do Movimento</h1>
            <p className="opening-deck">Um sistema de leitura para declarar aquilo que flui, aquilo que persiste e aquilo que se paga para sustentar uma forma.</p>
            <ReadingMeta />
            <div className="opening-actions">
              <a className="primary-link" href="#resumo">Começar a leitura <ArrowUpRight size={16} /></a>
              <a className="lab-link" href="/info">Mapa visual da teoria <ArrowUpRight size={15} /></a>
              <a className="lab-link" href="/lab">Laboratório de movimentos <ArrowUpRight size={15} /></a>
              <a className="lab-link" href="/cave">Leitura da caverna <ArrowUpRight size={15} /></a>
              <a className="lab-link" href="/cosmus">Fólio do tempo <ArrowUpRight size={15} /></a>
              <a className="pdf-link" href={bookPdfUrl} target="_blank" rel="noreferrer">
                <Download size={15} /> Baixar livro em PDF
              </a>
              <button className="copy-link" type="button" onClick={copyLink}>
                {copied ? <Check size={15} /> : <Copy size={15} />}
                {copied ? "Link copiado" : "Copiar link"}
              </button>
            </div>
          </div>
          <EditorialTrace className="opening-trace" />
        </section>

        <section className="reading-note" aria-label="Nota da edição">
          <EditorialTrace className="note-trace" />
          <div>
            <span>LEITURA ABERTA</span>
            <p>O índice acompanha a posição de leitura; os diagramas permanecem vivos e redimensionáveis no próprio texto.</p>
          </div>
        </section>

        <article className="manuscript" aria-label="Manuscrito Gramática do Movimento">
          <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]} components={markdownComponents}>
            {content}
          </ReactMarkdown>
        </article>

        <footer className="closing" id="fecho">
          <EditorialTrace className="closing-trace" />
          <div>
            <span>EDIÇÃO ESTÁTICA</span>
            <p>Texto, estrutura, diagramas e navegação permanecem disponíveis para revisão.</p>
          </div>
          <div className="closing-actions">
            <a href="/laboratorio">Abrir laboratório <ArrowUpRight size={15} /></a>
            <a href="#inicio">Voltar ao início <ArrowUpRight size={15} /></a>
          </div>
        </footer>
      </main>
    </div>
  );
}
