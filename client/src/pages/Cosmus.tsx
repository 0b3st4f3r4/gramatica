/**
 * Caderno de Margem: fólio temporal da Gramática — matéria inscrita, presente de decisão
 * e futuro de revisão com rastro. A metáfora não substitui as operações do manuscrito.
 */
import { ArrowLeft, ArrowUpRight, BookOpenText, Clock3, Eraser, Pencil, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "wouter";
import { EditorialMark } from "@/components/EditorialMark";

type TemporalFolio = {
  number: string;
  label: string;
  time: string;
  title: string;
  scene: string;
  matter: string;
  horizon: string;
  temporalRelation: string;
  operation: string;
  limit: string;
  reference: string;
};

const folios: TemporalFolio[] = [
  {
    number: "01",
    label: "CADERNO",
    time: "PASSADO CONSULTÁVEL",
    title: "A matéria que já recebeu inscrição.",
    scene: "O caderno reúne entradas, datas, moedas, custos e razões. Cada marca guarda um passado ao qual a leitura pode retornar.",
    matter: "Papel, arquivo, razão e tabela são suportes da inscrição. A matéria conserva a marca, mesmo quando a forma encontra outro suporte.",
    horizon: "O horizonte reúne a duração sob a qual a entrada ainda conta: uma sessão, uma política, uma instituição, uma geração.",
    temporalRelation: "Passado, aqui, é o que ganhou rastro. Ele permanece acessível à revisão e delimita o que uma descrição posterior pode alegar.",
    operation: "Consultar uma entrada é reencontrar as condições em que ela foi feita: recorte, moeda, observação, custo e data.",
    limit: "O caderno não torna uma inscrição definitiva. Ele impede que uma revisão finja começar sem antecedente.",
    reference: "Leitura do aspecto e da identidade de uma estrutura · §§ 1.3 e 3.1.",
  },
  {
    number: "02",
    label: "LÁPIS",
    time: "PRESENTE DE INSCRIÇÃO",
    title: "A mão decide no tempo em que escreve.",
    scene: "O lápis não representa um instante puro. Ele figura o trabalho de declarar um aspecto, escolher horizonte e moeda, nomear uma troca e assumir o custo da inscrição.",
    matter: "A ponta encontra resistência da folha. Toda decisão tem suporte, instrumento, corpo, atenção e um campo em que consegue ou não consegue circular.",
    horizon: "O horizonte é escolhido antes da classificação. Ele orienta o que será contado como persistência, evento, manutenção ou refluxo.",
    temporalRelation: "Presente é o ato situado de pôr uma relação em registro. O gesto muda a página e passa a responder pelo rastro que produz.",
    operation: "Escrever uma entrada é comprometer uma descrição com condições que outra pessoa pode ler, contestar e refazer.",
    limit: "A mão não escolhe retrospectivamente o horizonte que torna sua própria conclusão mais favorável.",
    reference: "Declaração de horizonte e aplicação das sete perguntas · §§ 3.1 e 3.4.",
  },
  {
    number: "03",
    label: "BORRACHA",
    time: "FUTURO DE REVISÃO",
    title: "A correção deixa o traço anterior legível.",
    scene: "A borracha figura um futuro em que uma forma pode perder posto, mudar de troca, ser revogada ou exigir outra entrada. A revisão entra datada na razão.",
    matter: "Na página física, a borracha remove grafite. No caderno da Gramática, a correção circunscreve a entrada anterior e acrescenta seu próprio rastro.",
    horizon: "O futuro aparece como intervalo de reexame: a duração em que uma observação nova, uma falha ou uma mudança de troca poderá cobrar resposta.",
    temporalRelation: "Futuro é a abertura regulada do registro. Ele não apaga o passado; torna o passado revisável sob condições declaradas.",
    operation: "Revisar é datar o retorno, nomear o que mudou e indicar a consequência para a derivação, para a moeda ou para a cláusula.",
    limit: "A borracha da metáfora não autoriza apagar uma falha. Sem rastro de correção, a página perde a razão de sua própria mudança.",
    reference: "Manutenção do grafo, catálogo de falhas e descida de posto · §§ 4.6 e 6.1.",
  },
];

function TemporalPlate({ activeIndex }: { activeIndex: number }) {
  return (
    <figure className="cosmus-plate" aria-labelledby="cosmus-plate-caption">
      <svg viewBox="0 0 720 420" role="img" aria-labelledby="cosmus-plate-title cosmus-plate-description">
        <title id="cosmus-plate-title">Caderno, lápis e borracha no tempo</title>
        <desc id="cosmus-plate-description">Um caderno de páginas sobrepostas à esquerda, um lápis no centro e uma borracha à direita, alinhados por uma linha temporal. Um arco tracejado indica o horizonte e um traço curvo indica o gesto que liga inscrição e revisão. O elemento ativo aparece em azul-petróleo.</desc>
        <path className="cosmus-time-line" d="M70 327H649" />
        <path className="cosmus-time-dots" d="M122 327h1m62 0h1m62 0h1m62 0h1m62 0h1m62 0h1m62 0h1" />
        <path className="cosmus-horizon-arc" d="M72 78c152-90 421-86 585 27" />
        <path className="cosmus-paper back" d="M73 93 257 72l25 205-183 20z" />
        <path className="cosmus-paper middle" d="m92 79 184-21 25 205-184 21z" />
        <path className="cosmus-paper front" d="m111 65 184-21 25 205-184 21z" />
        <path className="cosmus-rules" d="m140 98 118-13m-111 48 118-13m-111 48 118-13m-111 48 118-13" />
        <path className="cosmus-pencil-body" d="m319 265 184-184 46 46-184 184z" />
        <path className="cosmus-pencil-wood" d="m307 277 12-12 46 46-12 12z" />
        <path className="cosmus-pencil-lead" d="m298 286 9-9 12 12-9 9z" />
        <path className="cosmus-pencil-band" d="m481 103 22-22 46 46-22 22z" />
        <path className="cosmus-gesture" d="M307 286c-34-5-63 3-85 29-18 21-45 17-67 0" />
        <path className="cosmus-eraser-side" d="m527 264 111-73 41 61-111 73z" />
        <path className="cosmus-eraser-top" d="m527 264 40-22 41 61-40 22z" />
        <path className="cosmus-erased" d="m496 350 23-11m15 3 23-11m15 3 23-11m15 3 23-11" />
        <path className="cosmus-correction" d="M536 351c42 16 89 8 123-21" />
        <circle className={`cosmus-active-dot cosmus-active-${activeIndex}`} cx={activeIndex === 0 ? "199" : activeIndex === 1 ? "420" : "610"} cy="327" r="8" />
        <path className={`cosmus-active-rule cosmus-active-${activeIndex}`} d={activeIndex === 0 ? "M107 47 320 24" : activeIndex === 1 ? "M299 286 551 33" : "M527 345 680 244"} />
      </svg>
      <figcaption id="cosmus-plate-caption"><span>PLACA TEMPORAL · FÓLIO {String(activeIndex + 1).padStart(2, "0")}</span> Contornos fechados mostram objetos; arco, gesto e correção tornam visíveis horizonte, ação e revisão.</figcaption>
    </figure>
  );
}

export default function Cosmus() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [readingProgress, setReadingProgress] = useState(0);
  const active = folios[activeIndex];

  useEffect(() => {
    const updateProgress = () => {
      const limit = document.documentElement.scrollHeight - window.innerHeight;
      setReadingProgress(limit > 0 ? Math.min(1, window.scrollY / limit) : 0);
    };
    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, []);

  return (
    <main className="cosmus-page">
      <header className="cosmus-header">
        <Link href="/" className="cosmus-return"><ArrowLeft size={16} /> Retomar o manuscrito</Link>
        <div className="cosmus-brand"><EditorialMark /><span><b>GRAMÁTICA</b><b>DO MOVIMENTO</b><small>COSMUS · FÓLIO TEMPORAL 03</small></span></div>
      </header>

      <aside className="cosmus-margin" aria-label="Aparelho temporal de margem">
        <div className="cosmus-margin-head"><EditorialMark /><span>APARELHO<br />TEMPORAL</span></div>
        <p>EM LEITURA<br /><strong>{active.label}</strong></p>
        <div className="cosmus-progress" aria-label={`Progresso de leitura: ${Math.round(readingProgress * 100)}%`} role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(readingProgress * 100)}><i style={{ transform: `scaleY(${readingProgress})` }} /></div>
        <ol>{folios.map((folio, index) => <li className={folio.number === active.number ? "is-active" : ""} key={folio.number}><button type="button" onClick={() => setActiveIndex(index)} aria-label={`Ler fólio ${folio.number}: ${folio.label}`}><b>{folio.number}</b><small>{folio.label}</small></button></li>)}</ol>
        <span className="cosmus-margin-end">RASTRO · REVISÃO</span>
      </aside>

      <section className="cosmus-hero" aria-labelledby="cosmus-title">
        <div className="cosmus-hero-copy">
          <div className="cosmus-hero-stamp"><EditorialMark /></div>
          <p className="cosmus-kicker"><Clock3 size={15} /> COSMUS · MATÉRIA, HORIZONTE E TEMPO</p>
          <div className="cosmus-folio"><span>03</span><i aria-hidden="true" /><span>O TEMPO DE UMA PÁGINA</span></div>
          <h1 id="cosmus-title">O caderno sustenta o que passou.<br /><em>O lápis assume o agora.</em><br />A borracha prepara o retorno.</h1>
          <p>Na Gramática do Movimento, uma forma dura por trocas custeadas. A matéria guarda essas trocas, o horizonte define a duração sob exame e o tempo abre a página à revisão.</p>
        </div>
        <TemporalPlate activeIndex={activeIndex} />
      </section>

      <section className="cosmus-thesis" aria-labelledby="cosmus-thesis-title">
        <div><p>UMA LEITURA TEMPORAL</p><h2 id="cosmus-thesis-title">O aspecto decide em que duração uma forma será lida.</h2></div>
        <p>O manuscrito exige que o aspecto — horizonte temporal e moeda — seja declarado antes da classificação. Essa ordem importa: o horizonte não é cenário posterior; ele participa daquilo que a forma pode ser, manter ou perder. A relação entre matéria e tempo passa por essa escolha.</p>
      </section>

      <section className="cosmus-folios" aria-labelledby="cosmus-folios-title">
        <div className="cosmus-section-heading"><p>TRÊS FÓLIOS DA MESMA PÁGINA</p><h2 id="cosmus-folios-title">Passado inscrito, presente de gesto, futuro de revisão.</h2><span>Selecione um fólio. A sequência não é uma escada de progresso; ela descreve três posições que toda inscrição pode atravessar.</span></div>
        <ol className="cosmus-folio-register" aria-label="Fólios temporais">
          {folios.map((folio, index) => <li className={activeIndex === index ? "is-active" : ""} key={folio.number}><span>{folio.number}</span><div><small>FÓLIO · {folio.time}</small><button type="button" aria-pressed={activeIndex === index} aria-controls="cosmus-folio-detail" onClick={() => setActiveIndex(index)}>{folio.label}</button><p>{index === 0 ? "Rastro material" : index === 1 ? "Inscrição situada" : "Correção datada"}</p></div><EditorialMark className="cosmus-register-mark" /></li>)}
        </ol>
        <article id="cosmus-folio-detail" className="cosmus-folio-detail" role="tabpanel" aria-live="polite">
          <div className="cosmus-detail-header"><div><span>{active.number}</span><p>{active.time}</p></div><EditorialMark className="cosmus-detail-mark" /><h3>{active.title}</h3><p>{active.scene}</p></div>
          <dl className="cosmus-relation-grid">
            <div><dt><BookOpenText size={15} /> MATÉRIA</dt><dd>{active.matter}</dd></div>
            <div><dt><Clock3 size={15} /> HORIZONTE</dt><dd>{active.horizon}</dd></div>
            <div><dt><RotateCcw size={15} /> TEMPO</dt><dd>{active.temporalRelation}</dd></div>
          </dl>
          <div className="cosmus-operation"><Pencil size={17} /><div><span>OPERAÇÃO DE LEITURA</span><p>{active.operation}</p></div></div>
          <aside className="cosmus-limit"><Eraser size={20} /><div><span>CUIDADO DE MÉTODO</span><p>{active.limit}</p></div></aside>
          <p className="cosmus-reference">{active.reference} <Link href={active.number === "01" ? "/#1-3" : active.number === "02" ? "/#3-1-as-sete-perguntas" : "/#4-6-a-manutencao-do-grafo"}>Consultar a passagem <ArrowUpRight size={13} /></Link></p>
        </article>
      </section>

      <section className="cosmus-return-section" aria-labelledby="cosmus-return-title">
        <div><EditorialMark className="cosmus-return-mark" /><p>O FUTURO NÃO É UMA PÁGINA EM BRANCO</p><h2 id="cosmus-return-title">Revisar é escrever sobre um rastro que se conserva.</h2></div>
        <div><p>A matéria muda, um suporte pode ser trocado, uma hipótese pode perder posto. A razão permanece quando a mudança conserva a origem, a data e a consequência de sua correção. O futuro da Gramática é este espaço de reentrada que mantém o compromisso da página à vista.</p><p className="cosmus-question">O tempo se deixa perguntar assim: <strong>qual troca sustenta esta forma agora, até quando ela responde pelo que foi e que rastro sua revisão deverá deixar?</strong></p><Link href="/lab" className="cosmus-lab-link">Inscrever um caso no laboratório <ArrowUpRight size={16} /></Link></div>
      </section>

      <footer className="cosmus-footer"><p>LEITURA DERIVADA DO MANUSCRITO · AS FIGURAS MATERIAIS SÃO DIDÁTICAS</p><Link href="/" className="cosmus-return">Retomar o manuscrito <ArrowUpRight size={15} /></Link></footer>
    </main>
  );
}
