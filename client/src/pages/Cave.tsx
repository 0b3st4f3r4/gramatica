/**
 * Caderno de Margem: a caverna é lida como transposição situada — cena, suporte,
 * custo, retorno e limite — sem confundir a alegoria platônica com prova automática.
 */
import { ArrowLeft, ArrowUpRight, BookOpenText, CircleHelp, Eye, MoveUpRight, Undo2 } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import { EditorialMark } from "@/components/EditorialMark";

type CaveStage = {
  number: string;
  label: string;
  spineLabel: string;
  title: string;
  scene: string;
  form: string;
  host: string;
  currency: string;
  exchange: string;
  scale: string;
  reflow: string;
  limit: string;
  sustainingQuestion: string;
  contestation: string;
  returnRecord: string;
};

const stages: CaveStage[] = [
  {
    number: "01",
    label: "PAREDE",
    spineLabel: "SOMBRA",
    title: "Quando a aparição vira mundo suficiente",
    scene: "A cena começa por pessoas imobilizadas diante de uma parede, para as quais sombras e ecos podem valer pelo que há.[1]",
    form: "A sombra é uma forma de aparecimento: repetível, legível e capaz de organizar nomes.",
    host: "Parede, correntes, fogo e passagem dão corpo à forma; a aparência depende desse aparato.",
    currency: "Atenção e orientação: o que se paga ao manter os olhos, os nomes e os gestos voltados numa só direção.",
    exchange: "Uma figura projetada ocupa o lugar de outra coisa para quem não pode virar-se e conferir a relação.",
    scale: "O regime é coletivo: as pessoas conversam, nomeiam e aprendem a estabilizar as mesmas aparições.",
    reflow: "A repetição instala a mesma aparência como confirmação doméstica. Familiaridade e garantia continuam distintas.",
    limit: "A Gramática pergunta em que condições uma imagem passa a operar como referência suficiente.",
    sustainingQuestion: "Correntes, direção do olhar, parede, fogo, repetição e nomes compartilhados mantêm a aparência como referência suficiente.",
    contestation: "A contestação pede uma separação: que variação no suporte, na fonte, na voz ou no corpo permitiria distinguir a projeção do que ela projeta?",
    returnRecord: "Se alguém volta a esta posição, o caderno registra o que ainda se vê, o que mudou nas condições e o que a comunidade reconhece ou recusa.",
  },
  {
    number: "02",
    label: "FOGO",
    spineLabel: "SUPORTE",
    title: "A forma depende de uma sustentação que ela não mostra",
    scene: "Atrás dos prisioneiros, fogo, objetos transportados e vozes compõem o dispositivo que produz sombras e ecos.[1]",
    form: "A cena reúne sombra, objeto, luz, anteparo, nome e figura recebida num mesmo encadeamento.",
    host: "O fogo sustenta uma parte da projeção; os demais elos mantêm sua persistência.",
    currency: "Trabalho de manutenção, exposição e atenção compõem moedas diferentes, mantidas em registros próprios.",
    exchange: "O dispositivo reduz espessura e distância a contorno visível. O efeito pede comparação antes de ser tomado por equivalente.",
    scale: "A cadeia envolve quem carrega objetos, quem fala, quem vê e quem aprende a distinguir — ou deixa de distinguir.",
    reflow: "O suporte desaparece atrás do efeito quando a projeção funciona bem. Torná-lo visível reabre a pergunta pela origem.",
    limit: "O aparato visível ainda pede uma observação capaz de separar alternativas sobre sua origem.",
    sustainingQuestion: "A forma persiste porque uma cadeia material e coletiva sustenta a projeção, mesmo quando quem a recebe não vê a cadeia inteira.",
    contestation: "A contestação recompõe a cadeia: declara o elo observado, o elo que permanece opaco e a diferença que cada um produz.",
    returnRecord: "No retorno, anota-se se tornar o aparato visível alterou a relação com a sombra, com o nome ou com a autoridade de quem antes a explicava.",
  },
  {
    number: "03",
    label: "VIRADA",
    spineLabel: "VIRADA",
    title: "A virada exige tempo de visão",
    scene: "A libertação exige que alguém se vire, caminhe e encare luzes para as quais ainda não tem hábito; o percurso é descrito como doloroso e gradual.[1]",
    form: "A forma muda de posto: o que era inteiramente absorvente passa a aparecer como uma entre outras mediações possíveis.",
    host: "Corpo, caminho e adaptação sustentam a virada em duração, atrito e ambiente.",
    currency: "Dor, demora e reaprendizagem entram como custos situados, sem qualificar quem os suporta.",
    exchange: "A troca é uma mudança de orientação: perde-se a facilidade de uma leitura antiga antes de ganhar outra legível.",
    scale: "A experiência individual desloca um campo comum e pede mediações próprias antes de alcançar outras pessoas.",
    reflow: "O novo olhar retorna ao passado e reorganiza sua memória, por vezes corrigindo, exagerando ou deixando lacunas.",
    limit: "Desconforto entra como consequência declarada e pede forma, medida e reexame.",
    sustainingQuestion: "A virada se sustenta em tempo, corpo, caminho e adaptação; esses meios dão duração à nova orientação.",
    contestation: "O caderno pergunta que observação, comparação ou prática torna a mudança de orientação menos dependente de proclamação.",
    returnRecord: "O caderno da volta guarda tanto a aprendizagem que se estabilizou quanto os efeitos que não se repetiram, para que a passagem possa ser reexaminada.",
  },
  {
    number: "04",
    label: "RETORNO",
    spineLabel: "RETORNO",
    title: "A volta reabre o problema na moeda do campo",
    scene: "Ao retornar, quem saiu encontra de novo a escuridão, parece desajeitado diante das sombras e pode ser recebido com hostilidade.[1]",
    form: "O retorno abre outra relação: introduz diferença num regime que se mantinha estável.",
    host: "A mesma caverna continua a operar: nomes, recompensas e posições permanecem depois da passagem de alguém.",
    currency: "A pessoa que retorna paga em exposição, contestação e possível perda de posição; o campo paga em revisão e conflito.",
    exchange: "Para que uma diferença conte, ela precisa atravessar a linguagem disponível no campo sem apagar o que aquela linguagem ainda não vê.",
    scale: "A volta é pública: mudança de leitura toca distribuição de atenção, reconhecimento e autoridade entre pessoas.",
    reflow: "O refluxo conduz a revisão, recusa ou nova fixação. A trajetória exige registro do que de fato ocorreu.",
    limit: "Quem retorna expõe as condições em que a diferença falha, é recusada ou requer reexame; autoridade depende desse trabalho posterior.",
    sustainingQuestion: "A relação nova persiste ao encontrar meios de falar, mostrar e ser contestada dentro do campo ao qual retorna — e preserva o seu atrito.",
    contestation: "A contestação desloca a pergunta de 'quem tem razão?' para 'qual relação, prova e consequência permitem que a diferença permaneça examinável?'.",
    returnRecord: "O retorno é registrado como trajetória: resposta do campo, custos distribuídos, recusas, revisões e o ponto em que uma nova entrada passa a ser necessária.",
  },
];

function CaveDiagram({ selected }: { selected: CaveStage }) {
  const index = stages.findIndex((stage) => stage.number === selected.number);
  return (
    <figure className="cave-diagram" aria-labelledby="cave-diagram-caption">
      <svg viewBox="0 0 760 350" role="img" aria-labelledby="cave-diagram-title cave-diagram-description">
        <title id="cave-diagram-title">Esquema editorial da alegoria da caverna</title>
        <desc id="cave-diagram-description">Uma parede de sombras à esquerda, uma cadeia de projeção entre fogo, figuras e parede, uma subida para o exterior e um percurso de retorno. Linhas abertas indicam luz, voz, suporte e caminho; o estágio ativo aparece em azul-petróleo.</desc>
        <path className="cave-rock" d="M0 294V55c76-24 117 17 159 4 59-18 77-66 143-45 49 16 71 83 143 59 72-24 66-85 153-71 62 10 105 68 162 48v244H0Z" />
        <path className="cave-wall" d="M35 94c41-4 104 5 153-1l-1 177c-42 4-105-6-153 1Z" />
        <path className="cave-shadow" d="M76 212c18-48 49-48 67 0-17-14-50-14-67 0Zm64-57c10-29 33-29 43 0-11-8-32-8-43 0Z" />
        <path className="cave-floor" d="M0 294h580" />
        <path className="cave-path" d="M188 294c92-4 113-94 167-132 62-45 91-40 129-107 24-42 44-72 92-94" />
        <path className="cave-field" d="M20 79C177 21 287 73 384 45c100-29 209-22 350-41M20 316c159-25 275 14 406-24 128-37 220-9 317-34" />
        <path className="cave-light" d="M386 138 198 265M386 138 205 165M386 138 262 294" />
        <path className="cave-voice" d="M472 147c20 5 34 18 51 35m-44-49c28 1 50 19 67 39" />
        <path className="cave-chain" d="M386 138c25 9 40 14 67 15m4 0c15-2 31-11 46-17" />
        <circle className="cave-fire" cx="386" cy="138" r="14" />
        <path className="cave-carrier" d="M454 215v-62m-19 24 19-24 21 24m-21-24 23-20m-13 76 36 28" />
        <path className="cave-object" d="M475 147v-23c10-25 37-30 52-3v26c-16 3-34-3-52 0Z" />
        <path className="cave-sun" d="M613 42m-17 0a17 17 0 1 0 34 0 17 17 0 1 0-34 0M613 13v-8m0 74v-8m29-29h8m-74 0h-8m56-20 6-6m-44 44 6-6m32 0 6 6m-44-44 6 6" />
        <path className={`cave-active cave-active-${index}`} d={index === 0 ? "M84 264H166" : index === 1 ? "M363 169h46" : index === 2 ? "M421 137c38-9 60-38 87-71" : "M508 66c-54 59-78 113-116 183"} />
        <circle className={`cave-active-dot cave-active-${index}`} cx={index === 0 ? 166 : index === 1 ? 409 : index === 2 ? 508 : 392} cy={index === 0 ? 264 : index === 1 ? 169 : index === 2 ? 66 : 249} r="5" />
      </svg>
      <figcaption id="cave-diagram-caption"><span>MAPA DA CENA · {selected.number}</span> Linhas firmes organizam relações; traços abertos marcam luz, voz, suporte e caminho, que excedem a forma desenhada.</figcaption>
    </figure>
  );
}

export default function Cave() {
  const [activeStage, setActiveStage] = useState(0);
  const selected = stages[activeStage];

  return (
    <main className="cave-page">
      <header className="cave-header">
        <Link href="/" className="cave-return"><ArrowLeft size={16} /> Voltar ao manuscrito</Link>
        <div className="cave-brand"><EditorialMark /><span><b>GRAMÁTICA</b><b>DO MOVIMENTO</b><small>CADERNO DE TRANSPOSIÇÃO · 02</small></span></div>
      </header>

      <aside className="cave-margin" aria-label="Aparelho de margem da caverna">
        <div className="cave-margin-head"><EditorialMark /><span>CAVERNA</span><small>LEITURA · 02</small></div>
        <span>CAMADA · {selected.spineLabel}</span>
        <div className="cave-progress" aria-hidden="true"><i style={{ transform: `scaleY(${(activeStage + 1) / stages.length})` }} /></div>
        <ol>{stages.map((stage) => <li className={stage.number === selected.number ? "is-active" : ""} key={stage.number}><b>{stage.number}</b><small>{stage.spineLabel}</small></li>)}</ol>
      </aside>

      <section className="cave-hero" aria-labelledby="cave-title">
        <div className="cave-hero-copy">
          <div className="cave-hero-stamp"><EditorialMark /></div>
          <p className="cave-kicker"><EditorialMark /> LEITURA SITUADA · REPÚBLICA VII, 514a–517a</p>
          <div className="cave-folio"><span>02</span><i aria-hidden="true" /><span>UMA CENA QUE PEDE RELAÇÃO</span></div>
          <h1 id="cave-title">A caverna põe uma forma em cena.<br /><em>Sua sustentação fica fora do olhar.</em></h1>
          <p>Sombras, fogo, objetos, correntes, subida e retorno compõem a situação descrita na alegoria.[1] A Gramática acompanha as formas que ali se mantêm, suas moedas e a volta de uma diferença ao campo que a recebe.</p>
        </div>
        <CaveDiagram selected={selected} />
      </section>

      <section className="cave-orientation" aria-labelledby="cave-orientation-title">
        <div><p>ANTES DA TRANSPOSIÇÃO</p><h2 id="cave-orientation-title">Uma analogia posta em trabalho.</h2></div>
        <p>Em <em>República</em> VII, a caverna organiza uma analogia de educação, desorientação e retorno.[1] [2] Esta página toma seus elementos como cena de leitura e aplica as perguntas da Gramática sem atribuir esse vocabulário a Platão.</p>
      </section>

      <section className="cave-reading" aria-labelledby="cave-reading-title">
        <div className="cave-section-heading">
          <p>SOMBRA · SUPORTE · VIRADA · RETORNO</p>
          <h2 id="cave-reading-title">Quatro posições para ler a cena.</h2>
          <span>Escolha uma posição. Cada fólio abre um conjunto de relações e conserva o restante da alegoria fora do quadro.</span>
        </div>

        <div className="cave-stage-tabs" role="tablist" aria-label="Posições de leitura da caverna">
          {stages.map((stage, index) => (
            <button key={stage.number} type="button" role="tab" aria-selected={activeStage === index} aria-controls="cave-stage-detail" className={activeStage === index ? "is-active" : ""} onClick={() => setActiveStage(index)}>
              <span>{stage.number}</span><strong>{stage.label}</strong><small>{stage.spineLabel}</small>
            </button>
          ))}
        </div>

        <article id="cave-stage-detail" className="cave-stage-detail" role="tabpanel" aria-live="polite">
          <div className="cave-stage-intro"><span>{selected.number}</span><div><p>{selected.label} · CENA</p><h3>{selected.title}</h3></div></div>
          <p className="cave-scene">{selected.scene}</p>
          <dl className="cave-grammar-grid">
            <div><dt><Eye size={15} /> FORMA</dt><dd>{selected.form}</dd></div>
            <div><dt><BookOpenText size={15} /> HOSPEDEIRO</dt><dd>{selected.host}</dd></div>
            <div><dt><CircleHelp size={15} /> MOEDA</dt><dd>{selected.currency}</dd></div>
            <div><dt><MoveUpRight size={15} /> TROCA</dt><dd>{selected.exchange}</dd></div>
            <div><dt><span className="cave-dl-mark">↔</span> ESCALA</dt><dd>{selected.scale}</dd></div>
            <div><dt><Undo2 size={15} /> REFLUXO</dt><dd>{selected.reflow}</dd></div>
          </dl>
          <aside className="cave-limit"><EditorialMark /><div><span>LIMITE DE LEITURA</span><p>{selected.limit}</p></div></aside>
          <section className="cave-acts" aria-label={`Caderno de relação: ${selected.label}`}>
            <div className="cave-acts-heading"><EditorialMark /><div><span>CADERNO DE RELAÇÃO · {selected.number}</span><p>O caderno registra sustentação, contestação e retorno para dar corpo à transposição.</p></div></div>
            <ol>
              <li><span>01</span><div><strong>O que sustenta?</strong><p>{selected.sustainingQuestion}</p></div></li>
              <li><span>02</span><div><strong>O que pode contestar?</strong><p>{selected.contestation}</p></div></li>
              <li><span>03</span><div><strong>O que o retorno deve registrar?</strong><p>{selected.returnRecord}</p></div></li>
            </ol>
          </section>
        </article>
      </section>

      <section className="cave-return-section" aria-labelledby="cave-return-title">
        <div><EditorialMark className="cave-return-mark" /><p>O TESTE DA VOLTA</p><h2 id="cave-return-title">O retorno reabre a relação no campo.</h2></div>
        <div>
          <p>Na caverna, a volta ocorre sob custo: quem regressa parece incapaz diante do que era familiar e encontra um campo pronto a desautorizar a passagem.[1] Aqui se declaram a troca, sua moeda e o refluxo que ela produz.</p>
          <p className="cave-question">O registro começa por: <strong>que relação nova se sustenta, para quem, a que custo e sob que possibilidade de revisão?</strong></p>
          <Link href="/lab" className="cave-lab-link">Levar uma relação ao laboratório <ArrowUpRight size={16} /></Link>
        </div>
      </section>

      <footer className="cave-footer">
        <div><p>REFERÊNCIAS DE LEITURA</p><ol><li><a href="https://scaife.perseus.org/reader/urn:cts:greekLit:tlg0059.tlg030.perseus-eng2:7.514/" target="_blank" rel="noreferrer">[1] Platão, <em>República</em>, VII, 514a–517a. Scaife Viewer.</a></li><li><a href="https://plato.stanford.edu/entries/plato-myths/" target="_blank" rel="noreferrer">[2] C. Partenie, “Plato’s Myths”. <em>Stanford Encyclopedia of Philosophy</em>.</a></li></ol></div>
        <Link href="/" className="cave-return">Retornar à leitura <ArrowUpRight size={15} /></Link>
      </footer>
    </main>
  );
}
