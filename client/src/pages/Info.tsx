/*
 * Caderno de Margem: pranchas de orientação. Tipologia, moeda, posto e cláusula
 * permanecem relações de leitura; nenhum diagrama produz por si uma decisão ou prova.
 */
import { ArrowLeft, ArrowUpRight, CircleDot, GitFork } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "wouter";
import { EditorialMark } from "@/components/EditorialMark";
import { RepresentationKey } from "@/components/RepresentationKey";

type Folio = {
  number: string;
  family: string;
  title: string;
  question: string;
  lead: string;
  limit: string;
  selectorNote: string;
  manuscript: string;
  href: string;
};

const folios: Folio[] = [
  {
    number: "01",
    family: "FORMA",
    title: "Três comportamentos, uma pergunta de manutenção.",
    question: "O que uma forma faz para existir?",
    lead: "A tipologia separa evento, equilíbrio e forma fora do equilíbrio pelo que se espera quando a propagação ou a troca muda.",
    limit: "A prancha compara comportamentos previstos. Matéria, escala e custo concreto continuam no caso situado.",
    selectorNote: "comportamento previsto",
    manuscript: "Introdução · Figura 1 · Tabela 1",
    href: "/#1-introducao",
  },
  {
    number: "02",
    family: "CUSTO",
    title: "Toda persistência tem quem pague e em que se paga.",
    question: "Onde se paga uma persistência?",
    lead: "Hospedeiro, forma mantida e moeda formam um circuito. A moeda só entra quando o pagador e a consequência de sua retirada podem ser declarados.",
    limit: "A prancha organiza uma relação de sustentação. Ela não cria taxa de câmbio nem autoriza somar moedas distintas.",
    selectorNote: "pagador e consequência",
    manuscript: "Seção 3.2 · Figura 3 · Tabela 2",
    href: "/#3-2-as-moedas-e-a-metafora-controlada",
  },
  {
    number: "03",
    family: "ESTATUTO",
    title: "O que a moeda permite concluir depende de como se mede.",
    question: "O que a moeda permite concluir?",
    lead: "Medida, proxy e etiqueta não têm a mesma força. A cadeia de postos declara o alcance da derivação e a descida que um limite exige.",
    limit: "O desenho mostra a ordem de leitura. Método, ponto cego e reexame continuam necessários para situar uma entrada.",
    selectorNote: "método e descida",
    manuscript: "Seções 3.2–3.3 · Tabela 6 · Apêndice C",
    href: "/#3-3-planos-de-mensurabilidade",
  },
  {
    number: "04",
    family: "REVISÃO",
    title: "Uma troca só se identifica sob condições que aceitam falhar.",
    question: "Quando uma troca pode ser chamada de identificada?",
    lead: "A cláusula liga troca declarada, observação separadora, mapa de cegueira anterior e uma resposta que outro leitor pode cobrar.",
    limit: "A janela mantém os termos visíveis. Ela não classifica automaticamente um caso nem substitui sua razão datada.",
    selectorNote: "data, razão e caso",
    manuscript: "Seção 3.1, pergunta 5 · Seção 6.1",
    href: "/#3-1-as-sete-perguntas",
  },
  {
    number: "05",
    family: "TOPOLOGIA",
    title: "O conhecimento percorre um grafo antes de voltar a perguntar.",
    question: "Como o conhecimento se move sem virar escada?",
    lead: "Dez nós, sete movimentos e 22 instâncias organizam os percursos que partem da interrogação e retornam pela nova pergunta.",
    limit: "O grafo mostra transições permitidas. A moeda por aresta, o caso e a situação se consultam nas tabelas e na razão.",
    selectorNote: "nó, aresta e ciclo",
    manuscript: "Seção 4 · Figura 4 · Tabelas 3, 4, 7 e 8",
    href: "/#4-a-topologia-do-ciclo-do-conhecimento",
  },
  {
    number: "06",
    family: "CONVENÇÃO",
    title: "O mesmo grafo admite listas diferentes quando a regra muda.",
    question: "O que a contagem verifica — e o que ela não prova?",
    lead: "As trajetórias mudam de 32 para 36 ou 43 quando se levantam exclusões declaradas. O mapa permanece o mesmo; a convenção é que se desloca.",
    limit: "O número trava uma convenção de leitura. Ele não mede qualidade, autoridade ou verdade do sistema.",
    selectorNote: "32 · 36 · 43",
    manuscript: "Seção 4.5 · Apêndice B · Tabelas 7 e 8",
    href: "/#4-5-o-numero-das-trajetorias",
  },
  {
    number: "07",
    family: "CASOS",
    title: "Seis aplicações mostram posições; nenhuma recebe um placar.",
    question: "O que os seis casos mostram?",
    lead: "A matriz conserva forma, moeda, posto e veredito em colunas distintas. Um mesmo caso pode ocupar mais de um posto sem que a tabela o force a uma sentença única.",
    limit: "A matriz resume a posição de cada caso. Evidência, data, rival e observação separadora permanecem nas seções que sustentam a leitura.",
    selectorNote: "forma, moeda e posto",
    manuscript: "Seção 5.7 · Tabela 5",
    href: "/#5-7-o-que-os-seis-casos-produziram",
  },
  {
    number: "08",
    family: "REEXAME",
    title: "Revisar conserva o rastro daquilo que precisou ceder.",
    question: "O que um instrumento honesto faz quando falha?",
    lead: "O caderno separa artefato de aplicação, limite da gramática empírica, falha da cláusula e deslocamento da troca. Cada leitura produz uma consequência distinta para a cláusula e o posto.",
    limit: "A prancha organiza posições de reexame. Data, moeda, ponto cego, razão e observação continuam condições do caso e não cabem num veredito isolado.",
    selectorNote: "veredito e consequência",
    manuscript: "Seções 6.1–6.3 · Figura 5 · Tabela 6 · Apêndice E",
    href: "/#6-1-as-classes-do-vazamento",
  },
];

const typeModes = [
  { id: "event", label: "EVENTO", short: "Propaga", condition: "A continuidade da propagação é sua identidade.", result: "Se a propagação cessa, o evento se extingue.", cost: "O evento puro é caso-limite; a conta de custo corre sobre estruturas." },
  { id: "equilibrium", label: "EQUILÍBRIO", short: "Persiste", condition: "A forma se mantém por ligação num mínimo de energia.", result: "Depois de formada, persiste sem gasto contínuo.", cost: "Desfazê-la custa ao que a desfaz; a manutenção não cobra fluxo contínuo." },
  { id: "maintenance", label: "FORA DO EQUILÍBRIO", short: "Mantém", condition: "A forma persiste por troca contínua contra o fluxo.", result: "Se a troca cessa, a estrutura colapsa.", cost: "A moeda é a do hospedeiro e precisa ser declarada antes da descrição." },
] as const;

const currencies = [
  { id: "energy", label: "ENERGIA", host: "organismo", object: "estrutura mantida", status: "medida declarada antes da descrição", note: "A moeda nomeia o que o hospedeiro despende para manter uma forma." },
  { id: "budget", label: "ORÇAMENTO", host: "instituição", object: "estrutura mantida", status: "medida declarada antes da descrição", note: "A instituição aparece como pagadora apenas quando sua retirada produz consequência separável." },
  { id: "attention", label: "ATENÇÃO E ESFORÇO", host: "comunidade de ensino", object: "prática de ensino", status: "medida difícil; proxy declarado quando houver", note: "Medida difícil preserva a diferença da moeda, mas limita o posto que a derivação pode ocupar." },
] as const;

const measurementModes = [
  { id: "measured", label: "MEDIDA SUSTENTADA", result: "A moeda se declara com unidade e observação separadora administrável.", post: "previsão por número ou por contorno, conforme o caso" },
  { id: "proxy", label: "PROXY DECLARADO", result: "O proxy mostra seu recorte, direção de erro, troca não vista e data anterior ao evento.", post: "previsão por contorno; o ponto cego pode cobrar descida" },
  { id: "label", label: "ETIQUETA DECLARADA", result: "A medida permanece difícil e a metáfora controlada declara onde a palavra ordena sem demonstrar.", post: "ordenação" },
] as const;

const identificationModes = [
  { id: "mapped", label: "LIMITE MAPEADO", status: "Ponto cego declarado antes do vazamento.", effect: "Limite da gramática empírica: a previsão correspondente desce um posto.", tone: "teal" },
  { id: "clause", label: "FALHA DA CLÁUSULA", status: "Vazamento persistente, fora do ponto cego, em moeda mensurável e sem deslocamento observável.", effect: "A cláusula cai no caso; o caderno registra a queda sem remendo.", tone: "rust" },
  { id: "shift", label: "DESLOCAMENTO DA TROCA", status: "A troca muda de moeda ou de agente, sem desaparecer.", effect: "A descrição se corrige e a cláusula permanece deslocada.", tone: "graphite" },
] as const;

const topologyModes = [
  { id: "map", label: "MAPA", description: "Dez nós, sete tipos de movimento e 22 instâncias de aresta compõem a topologia declarada.", detail: "O desenho mantém avanços e ciclos distinguíveis; cada passagem se confere na matriz de adjacência." },
  { id: "trunk", label: "TRONCO", description: "Uma trajetória compartilha tronco com outra até a primeira bifurcação em que se separam.", detail: "O tronco é um prefixo comum, não uma rota privilegiada nem uma história necessária." },
  { id: "cycles", label: "CICLOS", description: "Cinco instâncias de ciclo reentram em nós já visitados e ficam fora da conta de trajetórias simples.", detail: "A exclusão vale pela convenção de não repetição de nó; ela não apaga a retroalimentação do grafo." },
] as const;

const countModes = [
  { id: "base", count: "32", label: "CONVENÇÃO BASE", description: "As duas exclusões declaradas permanecem na grafia da lista.", detail: "Três rotas ao padrão, com oito destinos, e duas à hipótese, com quatro destinos, formam a lista base." },
  { id: "single", count: "36", label: "UMA EXCLUSÃO LEVANTADA", description: "Levantar isoladamente qualquer uma das duas exclusões acrescenta quatro trajetórias.", detail: "A diferença pertence à regra de listagem, não a uma alteração na topologia." },
  { id: "both", count: "43", label: "AS DUAS EXCLUSÕES LEVANTADAS", description: "Levantar as duas exclusões amplia a lista para 43 trajetórias.", detail: "As duas arestas que revisitam o nó inicial continuam fora de qualquer percurso sem repetição." },
] as const;

const caseFamilies = [
  { id: "all", label: "TODOS", note: "seis casos" },
  { id: "knowledge", label: "CONHECIMENTO", note: "Wassermann e enciclopédia" },
  { id: "language", label: "LÍNGUA", note: "viralizar e moda" },
  { id: "institution", label: "INSTITUIÇÃO", note: "manual e plataforma" },
] as const;

const applicationCases = [
  { family: "knowledge", title: "Reação de Wassermann-Neisser-Bruck", form: "Estrutura fora do equilíbrio, o coletivo", currency: "Esforço do coletivo, atenção e tempo", standing: "Ordenação", verdict: "Vitória: trajetória com moeda declarada em cada aresta", section: "§5.1" },
  { family: "language", title: "O verbo viralizar", form: "Forma lexical no fluxo do uso", currency: "Atenção dos falantes, medida difícil", standing: "Ordenação no destino, ilustração no ato", verdict: "Vitória com o ponto cego do proxy declarado", section: "§5.2" },
  { family: "institution", title: "Manual de Redação da Presidência", form: "Estrutura fora do equilíbrio", currency: "Esforço editorial e burocrático", standing: "Ordenação geral, uma previsão por contorno", verdict: "Vitória com deslocamento de troca, entrada 1 do catálogo", section: "§5.3" },
  { family: "knowledge", title: "Enciclopédia colaborativa", form: "O verbete fixado no fluxo da vigilância", currency: "Atenção dos editores, medida difícil com proxy público", standing: "Previsão por contorno, a mais nítida da seção", verdict: "Vitória com a agenda empírica pendente", section: "§5.4" },
  { family: "language", title: "Moda e mudança na língua", form: "A mesma classificação nos dois casos", currency: "Atenção, com o mapa de cegueira do proxy datado", standing: "Ilustração do limite", verdict: "Derrota para Labov: o rival discrimina no presente", section: "§5.5" },
  { family: "institution", title: "Plataforma de atenção", form: "Estrutura fora do equilíbrio, com hospedeiro duplo", currency: "Atenção, medida difícil, proxy de engajamento com cegueira datada", standing: "Ordenação", verdict: "Vitória: câmbio oculto lido como institucionalizado", section: "§5.6" },
] as const;

const reviewModes = [
  { id: "artifact", label: "ARTEFATO DE APLICAÇÃO", condition: "O registro foi mal lido por um aplicador.", consequence: "A entrada vai ao caderno; a cláusula não se move.", record: "Posição da Tabela 6; pede leitura situada." },
  { id: "empirical", label: "LIMITE EMPÍRICO", condition: "O vazamento mora no ponto cego mapeado antes do teste.", consequence: "A previsão correspondente perde um posto na cadeia declarada.", record: "Catálogo: o limite entre moda e mudança ocupa o segundo veredito." },
  { id: "clause", label: "FALHA DA CLÁUSULA", condition: "Há vazamento persistente fora do ponto cego, em moeda mensurável e sem deslocamento observável.", consequence: "A cláusula cai no caso e a queda fica registrada sem remendo.", record: "O catálogo atual não tem instância; a condição permanece cobrável." },
  { id: "shift", label: "DESLOCAMENTO DA TROCA", condition: "A troca mudou de moeda ou de agente, sem desaparecer.", consequence: "A descrição se corrige e a cláusula sobrevive deslocada.", record: "Entrada 1: o Manual de Redação da Presidência." },
] as const;

type ArtifactEntry = {
  kind: "figure" | "table";
  number: string;
  title: string;
  function: string;
  limit: string;
  href: string;
  folio?: number;
};

const artifactEntries: ArtifactEntry[] = [
  { kind: "figure", number: "01", title: "Tipologia das formas", function: "Compara evento, equilíbrio e forma fora do equilíbrio pelo comportamento previsto.", limit: "Matéria, escala e custo concreto voltam ao caso.", href: "/#1-introducao", folio: 0 },
  { kind: "table", number: "01", title: "Tipologia das formas", function: "Fixa os três comportamentos em posições comparáveis.", limit: "A coluna não substitui a derivação da forma.", href: "/#1-introducao", folio: 0 },
  { kind: "figure", number: "02", title: "Cartografia de rivais", function: "Organiza o que a Gramática recebe, acrescenta ou cede ao rival.", limit: "A figura não conclui a disputa entre teorias.", href: "/#2-referencial-teorico" },
  { kind: "figure", number: "03", title: "Pagamento na moeda do hospedeiro", function: "Organiza pagamento, hospedeiro e moeda.", limit: "A figura não autoriza câmbio entre moedas.", href: "/#3-2-as-moedas-e-a-metafora-controlada", folio: 1 },
  { kind: "table", number: "02", title: "Quatorze moedas do mapa", function: "Declara as moedas e o estatuto de sua medida.", limit: "Medida, proxy, situação e data não se reduzem à célula.", href: "/#3-2-as-moedas-e-a-metafora-controlada", folio: 1 },
  { kind: "figure", number: "04", title: "Topologia do ciclo do conhecimento", function: "Mostra dez nós, sete movimentos e a topologia declarada.", limit: "O grafo mostra passagens; moeda, caso e suporte ficam exteriores.", href: "/#4-a-topologia-do-ciclo-do-conhecimento", folio: 4 },
  { kind: "table", number: "03", title: "Dez nós", function: "Nomeia estados epistemológicos.", limit: "A lista não confere verdade a um estado.", href: "/#4-1-os-nos", folio: 4 },
  { kind: "table", number: "04", title: "Sete movimentos", function: "Nomeia operações de transformação entre nós.", limit: "A operação exige origem, destino e contexto.", href: "/#4-2-as-arestas", folio: 4 },
  { kind: "table", number: "05", title: "Seis casos", function: "Conserva forma, moeda, posto e veredito em campos distintos.", limit: "A síntese não pontua aplicações.", href: "/#5-7-o-que-os-seis-casos-produziram", folio: 6 },
  { kind: "table", number: "06", title: "Estatutos e vereditos", function: "Ordena postos e consequências de revisão.", limit: "A tabela não classifica casos automaticamente.", href: "/#6-1-as-classes-do-vazamento", folio: 7 },
  { kind: "figure", number: "05", title: "Escada da degradação", function: "Lê a passagem de razão a carcaça legível.", limit: "Data, razão e caso sustentam a descida.", href: "/#6-3-a-razao-a-autoridade-e-a-historia", folio: 7 },
  { kind: "table", number: "07", title: "Trinta e duas trajetórias", function: "Lista trajetórias do grafo pleno por tronco.", limit: "A lista depende da convenção declarada.", href: "/#apendice-b-enumeracao-das-trajetorias", folio: 5 },
  { kind: "table", number: "08", title: "Matriz de adjacência", function: "Confere transições de avanço e ciclo.", limit: "A matriz não decide o significado da passagem.", href: "/#apendice-b-enumeracao-das-trajetorias", folio: 5 },
] as const;

function TypePlate({ mode }: { mode: (typeof typeModes)[number]["id"] }) {
  const selected = typeModes.find((entry) => entry.id === mode) ?? typeModes[0];
  return (
    <figure className="info-plate info-type-plate">
      <svg viewBox="0 0 720 260" role="img" aria-labelledby="type-plate-title type-plate-description">
        <title id="type-plate-title">Tipologia de formas por comportamento previsto</title>
        <desc id="type-plate-description">Três campos mostram uma linha de propagação para evento, uma forma ligada para equilíbrio e um circuito de troca para estrutura fora do equilíbrio. O campo selecionado aparece em azul-petróleo.</desc>
        <path className="info-plate-rule" d="M48 54H672" />
        <path className={`info-type-lane ${mode === "event" ? "is-active" : ""}`} d="M58 112h170m-44-17 44 17-44 17" />
        <circle className="info-type-particle" cx="98" cy="112" r="7" />
        <rect className={`info-type-block ${mode === "equilibrium" ? "is-active" : ""}`} x="291" y="84" width="106" height="58" rx="0" />
        <path className="info-type-binding" d="M308 113h72m-53-14 34 28m0-28-34 28" />
        <path className={`info-type-loop ${mode === "maintenance" ? "is-active" : ""}`} d="M500 112c0-37 110-37 110 0s-110 37-110 0Zm12 0h86" />
        <path className="info-type-exchange" d="M556 56v38m0 36v38m-12-12 12 12 12-12" />
        <path className="info-type-field" d="M40 205c94-28 143 26 240-7s165 20 250-4 110 3 156-17" />
      </svg>
      <figcaption><span>TIPOLOGIA TRAVADA · {selected.label}</span><p>{selected.condition}</p><p><strong>COMPORTAMENTO PREVISTO.</strong> {selected.result}</p></figcaption>
    </figure>
  );
}

function CurrencyPlate({ currency }: { currency: (typeof currencies)[number] }) {
  return (
    <figure className="info-plate info-currency-plate">
      <svg viewBox="0 0 720 260" role="img" aria-labelledby="currency-plate-title currency-plate-description">
        <title id="currency-plate-title">Circuito de hospedeiro e moeda</title>
        <desc id="currency-plate-description">Um contorno à esquerda representa o hospedeiro, outro à direita representa a forma mantida e linhas fechadas indicam pagamento e manutenção. Um arco aberto indica o campo da medida.</desc>
        <rect className="info-currency-host" x="67" y="79" width="182" height="96" rx="0" />
        <rect className="info-currency-form" x="471" y="79" width="182" height="96" rx="0" />
        <path className="info-currency-payment" d="M249 108h190m-22-13 22 13-22 13" />
        <path className="info-currency-return" d="M471 146H281m22-13-22 13 22 13" />
        <path className="info-currency-field" d="M78 52c127-51 415-50 565 2" />
        <circle className="info-currency-coin" cx="344" cy="108" r="25" />
        <path className="info-currency-cut" d="M344 79v58" />
        <path className="info-currency-support" d="M158 197c73 27 153 20 220 3 80-20 169 25 263-3" />
      </svg>
      <figcaption><span>CIRCUITO DE HOSPEDEIRO · {currency.label}</span><p><strong>HOSPEDEIRO.</strong> {currency.host} · <strong>ESTRUTURA.</strong> {currency.object}</p><p><strong>ESTATUTO.</strong> {currency.status}</p></figcaption>
    </figure>
  );
}

function StatutePlate({ mode }: { mode: (typeof measurementModes)[number]["id"] }) {
  const activeIndex = measurementModes.findIndex((entry) => entry.id === mode);
  return (
    <figure className="info-plate info-statute-plate">
      <svg viewBox="0 0 720 286" role="img" aria-labelledby="statute-plate-title statute-plate-description">
        <title id="statute-plate-title">Cadeia de postos e planos de mensurabilidade</title>
        <desc id="statute-plate-description">Uma escada de quatro níveis organiza previsão por número, previsão por contorno, ordenação e ilustração. Um marcador azul-petróleo mostra o plano selecionado e setas abertas mostram que um limite pode exigir descida.</desc>
        {[0, 1, 2, 3].map((step) => <path className={`info-statute-step ${step === activeIndex ? "is-active" : ""}`} key={step} d={`M${85 + step * 132} ${220 - step * 45}h132v-45`} />)}
        <path className="info-statute-fall" d="M554 57c32 23 32 69 1 96-17 15-23 42-1 66m-12-5 12 5 5-12" />
        <path className="info-statute-horizon" d="M63 251c151-30 264 4 364-23 91-24 162 8 233-10" />
      </svg>
      <figcaption><span>CADEIA DE POSTOS · {measurementModes[activeIndex].label}</span><p>{measurementModes[activeIndex].result}</p><p><strong>ALCANCE.</strong> {measurementModes[activeIndex].post}</p></figcaption>
    </figure>
  );
}

function IdentificationPlate({ mode }: { mode: (typeof identificationModes)[number]["id"] }) {
  const active = identificationModes.find((entry) => entry.id === mode) ?? identificationModes[0];
  return (
    <figure className={`info-plate info-identification-plate is-${active.tone}`}>
      <svg viewBox="0 0 720 286" role="img" aria-labelledby="identification-plate-title identification-plate-description">
        <title id="identification-plate-title">Janela da cláusula de identificação</title>
        <desc id="identification-plate-description">Quatro contornos formam uma janela: troca declarada, observação separadora, ponto cego anterior e resposta possível. Traços abertos saem da janela para mostrar que o caso e a razão permanecem exteriores ao desenho.</desc>
        <rect className="info-identification-window" x="170" y="42" width="380" height="190" rx="0" />
        <path className="info-identification-cross" d="M360 42v190M170 137h380" />
        <path className="info-identification-gate" d="M117 105h53m-15-13 15 13-15 13M550 176h53m-15-13 15 13-15 13" />
        <path className="info-identification-field" d="M54 256c93-45 158 18 246-16 88-34 173 22 362-21" />
        <path className="info-identification-trace" d="M88 65c35-32 75-31 112-9m320 170c44-7 72 13 108 31" />
        <circle className="info-identification-active" cx={mode === "mapped" ? "265" : mode === "clause" ? "455" : "455"} cy={mode === "mapped" ? "94" : mode === "clause" ? "184" : "94"} r="7" />
      </svg>
      <figcaption><span>JANELA DA CLÁUSULA · {active.label}</span><p>{active.status}</p><p><strong>LEITURA.</strong> {active.effect}</p></figcaption>
    </figure>
  );
}

function TopologyPlate({ mode }: { mode: (typeof topologyModes)[number]["id"] }) {
  const selected = topologyModes.find((entry) => entry.id === mode) ?? topologyModes[0];
  const highlightCycles = mode === "cycles";
  const highlightTrunk = mode === "trunk";
  const nodes = [
    [80, 176, "?", "INTERROGAÇÃO"], [182, 99, "⊙", "OBSERVAÇÃO"], [265, 164, "→", "DADO"], [360, 98, "↗", "PADRÃO"], [466, 163, "⇄", "HIPÓTESE"], [565, 114, "⇢", "TESTE"], [650, 70, "✓", "CONFIRMAÇÃO"], [650, 208, "✗", "REFUTAÇÃO"], [525, 230, "∞", "SÍNTESE"], [370, 233, "⇡", "NOVA PERGUNTA"],
  ] as const;
  const trunkNodes = new Set(["?", "⊙", "→", "↗", "⇄", "⇢", "✓", "∞", "⇡"]);
  return (
    <figure className="info-plate info-topology-plate">
      <svg viewBox="0 0 720 332" role="img" aria-labelledby="topology-plate-title topology-plate-description">
        <title id="topology-plate-title">Topologia do ciclo do conhecimento</title>
        <desc id="topology-plate-description">Dez nós do ciclo do conhecimento são ligados por 17 instâncias de avanço e cinco de ciclo. O modo selecionado destaca o mapa inteiro, um tronco de trajetória ou os ciclos que ficam fora da contagem de trajetórias sem nó repetido.</desc>
        <path className="info-topology-field" d="M42 281c77-36 137 24 222-8 78-30 164 28 245-2 77-29 119 8 171-18" />
        <g className={highlightCycles ? "is-muted" : ""}><path className={`info-topology-advance ${highlightTrunk ? "is-trunk" : ""}`} d="M89 174 174 104M91 176 254 166M190 112 253 158M193 101 345 96M274 159 343 106M278 169 452 163M373 106 448 154M379 99 548 112M481 155 551 117M481 169 514 229M580 113 641 72M579 119 644 204M651 83 541 224M648 194 541 230M641 81 385 231M642 211 386 231M510 231 387 231" /></g>
        <g className={highlightCycles ? "is-active" : ""}><path className="info-topology-cycle" d="M644 213C524 309 188 282 89 180M640 66C510 38 306 37 191 93M643 202C522 233 314 172 191 105M561 126C492 102 432 95 376 101M369 242C277 283 151 256 87 183" /></g>
        {nodes.map(([x, y, glyph, label]) => <g className={`info-topology-node ${highlightTrunk && trunkNodes.has(glyph) ? "is-trunk" : ""}`} key={label}><circle cx={x} cy={y} r="13" /><text x={x} y={y + 4} textAnchor="middle">{glyph}</text><text className="info-topology-label" x={x} y={y + 29} textAnchor="middle">{label}</text></g>)}
      </svg>
      <figcaption><span>TOPOLOGIA DO CICLO · {selected.label}</span><p>{selected.description}</p><p><strong>LEITURA.</strong> {selected.detail}</p></figcaption>
    </figure>
  );
}

function SensitivityPlate({ mode }: { mode: (typeof countModes)[number]["id"] }) {
  const selected = countModes.find((entry) => entry.id === mode) ?? countModes[0];
  return (
    <figure className="info-plate info-sensitivity-plate">
      <svg viewBox="0 0 720 286" role="img" aria-labelledby="sensitivity-plate-title sensitivity-plate-description">
        <title id="sensitivity-plate-title">Sensibilidade da contagem de trajetórias</title>
        <desc id="sensitivity-plate-description">Três folhas de contagem mostram 32, 36 e 43 trajetórias sob convenção base, uma exclusão levantada e duas exclusões levantadas. A folha selecionada aparece com filete azul-petróleo.</desc>
        <path className="info-sensitivity-horizon" d="M56 247c99-40 160 16 255-13 98-30 188 25 353-17" />
        {countModes.map((entry, index) => <g className={`info-sensitivity-sheet ${entry.id === mode ? "is-active" : ""}`} key={entry.id} transform={`translate(${74 + index * 212} ${index === 1 ? 65 : index === 2 ? 48 : 84})`}><rect width="168" height="121" rx="0" /><path d="M22 30h124M22 47h82M22 94h124" /><text x="22" y="82">{entry.count}</text><circle cx="143" cy="94" r="6" /></g>)}
        <path className="info-sensitivity-open" d="M91 57c54-31 134-30 192 2m18-15c72-32 154-29 225 10" />
      </svg>
      <figcaption><span>SENSIBILIDADE DA LISTA · {selected.label}</span><p>{selected.description}</p><p><strong>CONVENÇÃO.</strong> {selected.detail}</p></figcaption>
    </figure>
  );
}

function CasesPlate({ family }: { family: (typeof caseFamilies)[number]["id"] }) {
  const visibleCases = family === "all" ? applicationCases : applicationCases.filter((entry) => entry.family === family);
  const selectedFamily = caseFamilies.find((entry) => entry.id === family) ?? caseFamilies[0];
  return (
    <figure className="info-plate info-cases-plate">
      <figcaption><span>MATRIZ DE APLICAÇÕES · {selectedFamily.label}</span><p>As colunas mantêm funções distintas. O resumo não troca moeda por posto, nem veredito por evidência.</p></figcaption>
      <div className="info-case-table-wrap"><table className="info-case-table"><thead><tr><th scope="col">CASO</th><th scope="col">FORMA</th><th scope="col">MOEDA</th><th scope="col">POSTO</th><th scope="col">VEREDITO</th></tr></thead><tbody>{visibleCases.map((entry) => <tr key={entry.title}><th scope="row"><small>{entry.section}</small>{entry.title}</th><td data-label="FORMA">{entry.form}</td><td data-label="MOEDA">{entry.currency}</td><td data-label="POSTO">{entry.standing}</td><td data-label="VEREDITO">{entry.verdict}</td></tr>)}</tbody></table></div>
    </figure>
  );
}

function ReviewPlate({ mode }: { mode: (typeof reviewModes)[number]["id"] }) {
  const selected = reviewModes.find((entry) => entry.id === mode) ?? reviewModes[0];
  return (
    <figure className="info-plate info-review-plate">
      <svg viewBox="0 0 720 254" role="img" aria-labelledby="review-plate-title review-plate-description">
        <title id="review-plate-title">Quatro posições de reexame</title>
        <desc id="review-plate-description">Quatro entradas de caderno representam artefato de aplicação, limite empírico, falha da cláusula e deslocamento da troca. A entrada selecionada recebe um filete azul-petróleo. Traços abertos indicam que data, razão e caso continuam exteriores à lista.</desc>
        <path className="info-review-field" d="M48 221c103-33 146 13 243-14 92-26 159 19 369-11" />
        {reviewModes.map((entry, index) => <g className={`info-review-entry ${entry.id === mode ? "is-active" : ""}`} key={entry.id} transform={`translate(${62 + index * 162} ${index % 2 ? 69 : 52})`}><rect width="128" height="108" rx="0" /><path d="M16 25h92M16 42h64M16 76h92" /><text x="16" y="64">0{index + 1}</text><circle cx="106" cy="76" r="5" /></g>)}
        <path className="info-review-trace" d="M51 37c46-20 80-17 123 0m198 164c37-25 88-23 129 0" />
      </svg>
      <figcaption><span>CADERNO DE REVISÃO · {selected.label}</span><p>{selected.condition}</p><p><strong>CONSEQUÊNCIA.</strong> {selected.consequence}</p><p><strong>RASTRO.</strong> {selected.record}</p></figcaption>
    </figure>
  );
}

function ArtifactIndex({ onFolioOpen }: { onFolioOpen: (index: number) => void }) {
  const [filter, setFilter] = useState<"all" | "figure" | "table">("all");
  const visibleEntries = filter === "all" ? artifactEntries : artifactEntries.filter((entry) => entry.kind === filter);
  return (
    <section id="indice-de-artefatos" className="info-artifact-index" aria-labelledby="artifact-index-title">
      <header className="info-artifact-heading"><div><p>ÍNDICE DE FIGURAS E TABELAS</p><h2 id="artifact-index-title">Treze artefatos, cada qual com alcance declarado.</h2></div><p>O índice reúne portas de leitura. A remissão abre a seção que formula o artefato; a prancha apenas recupera a operação visual correspondente.</p></header>
      <div className="info-artifact-filter" aria-label="Filtrar artefatos por tipo">{(["all", "figure", "table"] as const).map((kind) => <button type="button" key={kind} className={filter === kind ? "is-active" : ""} onClick={() => setFilter(kind)}><span>{kind === "all" ? "13" : kind === "figure" ? "05" : "08"}</span>{kind === "all" ? "TODOS" : kind === "figure" ? "FIGURAS" : "TABELAS"}</button>)}</div>
      <ol className="info-artifact-list">{visibleEntries.map((entry) => <li key={`${entry.kind}-${entry.number}`}><span className={`info-artifact-kind is-${entry.kind}`}>{entry.kind === "figure" ? "FIGURA" : "TABELA"}<b>{entry.number}</b></span><div><h3>{entry.title}</h3><p>{entry.function}</p><em><b>FORA DO QUADRO.</b> {entry.limit}</em></div><nav aria-label={`Remissões para ${entry.kind} ${entry.number}`}><Link href={entry.href}>Abrir a seção <ArrowUpRight size={13} /></Link>{entry.folio !== undefined && <button type="button" onClick={() => onFolioOpen(entry.folio!)}>Ver a prancha <EditorialMark /></button>}</nav></li>)}</ol>
    </section>
  );
}

function FolioVisual({ folioIndex }: { folioIndex: number }) {
  const [typeMode, setTypeMode] = useState<(typeof typeModes)[number]["id"]>("event");
  const [currencyId, setCurrencyId] = useState<(typeof currencies)[number]["id"]>("energy");
  const [measurementMode, setMeasurementMode] = useState<(typeof measurementModes)[number]["id"]>("measured");
  const [identificationMode, setIdentificationMode] = useState<(typeof identificationModes)[number]["id"]>("mapped");
  const [topologyMode, setTopologyMode] = useState<(typeof topologyModes)[number]["id"]>("map");
  const [countMode, setCountMode] = useState<(typeof countModes)[number]["id"]>("base");
  const [caseFamily, setCaseFamily] = useState<(typeof caseFamilies)[number]["id"]>("all");
  const [reviewMode, setReviewMode] = useState<(typeof reviewModes)[number]["id"]>("artifact");
  const currency = currencies.find((entry) => entry.id === currencyId) ?? currencies[0];

  if (folioIndex === 0) return <div className="info-folio-visual"><TypePlate mode={typeMode} /><div className="info-choice-row" aria-label="Aspecto de leitura da tipologia">{typeModes.map((entry) => <button type="button" className={typeMode === entry.id ? "is-active" : ""} onClick={() => setTypeMode(entry.id)} key={entry.id}><span>{entry.short}</span>{entry.label}</button>)}</div><p className="info-visual-note"><strong>O custo entra na leitura.</strong> {typeModes.find((entry) => entry.id === typeMode)?.cost}</p></div>;
  if (folioIndex === 1) return <div className="info-folio-visual"><CurrencyPlate currency={currency} /><div className="info-choice-row" aria-label="Moeda de leitura">{currencies.map((entry) => <button type="button" className={currencyId === entry.id ? "is-active" : ""} onClick={() => setCurrencyId(entry.id)} key={entry.id}><span>{entry.host}</span>{entry.label}</button>)}</div><p className="info-visual-note"><strong>Sem câmbio.</strong> {currency.note}</p></div>;
  if (folioIndex === 2) return <div className="info-folio-visual"><StatutePlate mode={measurementMode} /><div className="info-choice-row" aria-label="Plano de mensurabilidade">{measurementModes.map((entry) => <button type="button" className={measurementMode === entry.id ? "is-active" : ""} onClick={() => setMeasurementMode(entry.id)} key={entry.id}><span>PLANO</span>{entry.label}</button>)}</div><p className="info-visual-note"><strong>Descida registrada.</strong> Um limite ou um ponto cego não desaparece: altera o posto e permanece na razão.</p></div>;
  if (folioIndex === 3) return <div className="info-folio-visual"><IdentificationPlate mode={identificationMode} /><div className="info-choice-row" aria-label="Leitura de vazamento">{identificationModes.map((entry) => <button type="button" className={identificationMode === entry.id ? "is-active" : ""} onClick={() => setIdentificationMode(entry.id)} key={entry.id}><span>CASO</span>{entry.label}</button>)}</div><p className="info-visual-note"><strong>O desenho não decide.</strong> A classe só ganha sentido com data, razão, caso e uma observação que permaneça examinável.</p></div>;
  if (folioIndex === 4) return <div className="info-folio-visual"><TopologyPlate mode={topologyMode} /><div className="info-choice-row" aria-label="Leitura do grafo">{topologyModes.map((entry) => <button type="button" className={topologyMode === entry.id ? "is-active" : ""} onClick={() => setTopologyMode(entry.id)} key={entry.id}><span>RECORTE</span>{entry.label}</button>)}</div><p className="info-visual-note"><strong>Sete movimentos; nenhuma hierarquia linear.</strong> Uma trajetória é um percurso sem nó repetido que sai da interrogação e retorna pela nova pergunta.</p></div>;
  if (folioIndex === 5) return <div className="info-folio-visual"><SensitivityPlate mode={countMode} /><div className="info-choice-row" aria-label="Convenção de contagem">{countModes.map((entry) => <button type="button" className={countMode === entry.id ? "is-active" : ""} onClick={() => setCountMode(entry.id)} key={entry.id}><span>LISTA</span>{entry.count} · {entry.label}</button>)}</div><p className="info-visual-note"><strong>Mesmo grafo, regras de lista distintas.</strong> A enumeração é auditável porque declara o que inclui e exclui.</p></div>;
  if (folioIndex === 6) return <div className="info-folio-visual"><CasesPlate family={caseFamily} /><div className="info-choice-row" aria-label="Domínio dos casos">{caseFamilies.map((entry) => <button type="button" className={caseFamily === entry.id ? "is-active" : ""} onClick={() => setCaseFamily(entry.id)} key={entry.id}><span>{entry.note}</span>{entry.label}</button>)}</div><p className="info-visual-note"><strong>O caso não cabe numa linha.</strong> A matriz mantém os campos separados para devolver o leitor ao argumento e ao limite de cada aplicação.</p></div>;
  return <div className="info-folio-visual"><ReviewPlate mode={reviewMode} /><div className="info-choice-row" aria-label="Posição de reexame">{reviewModes.map((entry) => <button type="button" className={reviewMode === entry.id ? "is-active" : ""} onClick={() => setReviewMode(entry.id)} key={entry.id}><span>VEREDITO</span>{entry.label}</button>)}</div><p className="info-visual-note"><strong>Revisar não apaga.</strong> A entrada anterior permanece legível e a consequência se declara na razão.</p></div>;
}

export default function Info() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const active = folios[activeIndex];

  useEffect(() => {
    const updateProgress = () => {
      const limit = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(limit > 0 ? Math.min(1, window.scrollY / limit) : 0);
    };
    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    return () => { window.removeEventListener("scroll", updateProgress); window.removeEventListener("resize", updateProgress); };
  }, []);

  return (
    <main className="info-page">
      <header className="info-header">
        <Link href="/" className="info-return"><ArrowLeft size={16} /> Retomar o manuscrito</Link>
        <div className="info-brand"><EditorialMark /><span><b>GRAMÁTICA</b><b>DO MOVIMENTO</b><small>PRANCHAS DE ORIENTAÇÃO · 08</small></span></div>
      </header>

      <aside className="info-margin" aria-label="Aparelho de margem dos infográficos">
        <div className="info-margin-head"><EditorialMark /><span>MAPA<br />VISUAL</span><small>INFO · 08</small></div>
        <p><small>FÓLIO EM LEITURA</small><strong>{active.number} · {active.family}</strong><em>prancha e limite</em></p>
        <div className="info-progress" role="progressbar" aria-label={`Progresso de leitura: ${Math.round(progress * 100)}%`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress * 100)}><i style={{ transform: `scaleY(${progress})` }} /></div>
        <ol>{folios.map((folio, index) => <li className={index === activeIndex ? "is-active" : ""} key={folio.number}><button type="button" onClick={() => setActiveIndex(index)} aria-label={`Abrir fólio ${folio.number}: ${folio.family}`}><b>{folio.number}</b><small>{folio.family}</small></button></li>)}</ol>
        <span className="info-margin-end">RELAÇÃO · LIMITE</span>
      </aside>

      <section className="info-hero" aria-labelledby="info-title">
        <div className="info-hero-copy">
          <div className="info-hero-stamp"><EditorialMark /></div>
          <div className="info-publication-deck"><EditorialMark /><div><b>GRAMÁTICA</b><b>DO MOVIMENTO</b><small>EDIÇÃO DIGITAL · CADERNO DE ORIENTAÇÃO</small></div></div>
          <p className="info-kicker"><EditorialMark /> MAPA VISUAL · OITO FÓLIOS</p>
          <div className="info-folio"><span>08</span><i aria-hidden="true" /><span>LER ANTES DE CONCLUIR</span></div>
          <div className="info-hero-register" aria-label={`Fólio em leitura: ${active.number}, ${active.family}`}><EditorialMark /><div><small>APARELHO DE MARGEM</small><strong>FÓLIO {active.number} · {active.family}</strong><i aria-hidden="true">{Array.from({ length: 8 }, (_, index) => <b className={index === activeIndex ? "is-active" : ""} key={index} />)}</i></div><span>{String(activeIndex + 1).padStart(2, "0")} / 08</span></div>
          <h1 id="info-title">A teoria pede que se veja a relação.<br /><em>O limite devolve a leitura ao caso.</em></h1>
          <p>Estas pranchas condensam forma, hospedeiro, moeda, posto, cláusula, grafo, convenção, caso e revisão. Cada uma abre uma operação da Gramática e mantém seu alcance declarado.</p>
        </div>
        <figure className="info-hero-plate">
          <svg viewBox="0 0 720 370" role="img" aria-labelledby="info-hero-plate-title info-hero-plate-description">
            <title id="info-hero-plate-title">Seis pranchas de orientação da Gramática do Movimento</title>
            <desc id="info-hero-plate-description">Seis superfícies distintas mostram uma propagação, um circuito de moeda, uma escada de postos, uma janela de identificação, uma topologia e uma folha de contagem. Linhas abertas e um arco tracejado indicam os limites externos à representação.</desc>
            <path className="info-hero-field" d="M42 312c91-45 155 18 239-12 100-36 162 29 262-8 52-19 98-7 142-28" />
            <rect className="info-hero-card" x="64" y="74" width="132" height="112" rx="0" />
            <path className="info-hero-line" d="M88 129h78m-21-14 21 14-21 14" />
            <rect className="info-hero-card" x="278" y="74" width="132" height="112" rx="0" />
            <path className="info-hero-loop" d="M303 132c0-25 82-25 82 0s-82 25-82 0Zm9 0h64" />
            <rect className="info-hero-card" x="492" y="74" width="132" height="112" rx="0" />
            <path className="info-hero-stair" d="M516 158h24v-20h24v-20h24v-20h24" />
            <rect className="info-hero-window" x="228" y="217" width="250" height="64" rx="0" />
            <path className="info-hero-window-cross" d="M353 217v64M228 249h250" />
            <circle className="info-hero-node" cx="570" cy="243" r="16" /><path className="info-hero-node-link" d="M495 243h58m34 0h61" />
            <rect className="info-hero-count" x="72" y="220" width="78" height="46" rx="0" /><path className="info-hero-count-rule" d="M86 236h50M86 250h31" />
            <path className="info-hero-arc" d="M86 42c144-56 357-55 548 3" />
          </svg>
          <figcaption><span>LINHA · CIRCUITO · ESCADA · JANELA · GRAFO · CADERNO · MATRIZ · REVISÃO</span> Uma forma para cada operação; o campo, a matéria, a moeda e a convenção continuam declarados fora da imagem.</figcaption>
        </figure>
      </section>

      <section className="info-orientation" aria-labelledby="info-orientation-title">
        <div><p>OITO ENTRADAS, SEM ATALHO DE VEREDITO</p><h2 id="info-orientation-title">Ver uma estrutura não dispensa declarar como ela vale.</h2></div>
        <p>As pranchas orientam a primeira leitura e devolvem ao manuscrito a formulação completa. Nenhum desenho converte comparação em prova ou escolhe um veredito no lugar de quem aplica a Gramática.</p>
        <RepresentationKey compact className="info-representation-key" />
      </section>

      <section className="info-folios" aria-labelledby="info-folios-title">
        <div className="info-section-heading"><p>FÓLIOS 01–08</p><h2 id="info-folios-title">Forma, custo, estatuto, cláusula, grafo, convenção, caso e revisão.</h2><span>Selecione uma prancha. A margem conserva a posição atual e a sequência não cria uma escada de certeza.</span></div>
        <ol className="info-folio-register" aria-label="Fólios sequenciais do caderno de orientação">
          {folios.map((folio, index) => <li className={index === activeIndex ? "is-active" : ""} key={folio.number}><span>{folio.number}</span><div><small>{folio.family} · PERGUNTA</small><button type="button" aria-pressed={index === activeIndex} aria-controls="info-folio-detail" onClick={() => setActiveIndex(index)}>{folio.question}</button><p>{folio.title}</p><em><b>RECORTE.</b> {folio.selectorNote}</em></div><EditorialMark className="info-register-mark" /></li>)}
        </ol>

        <article id="info-folio-detail" className="info-folio-detail" role="tabpanel" aria-live="polite">
          <header className="info-detail-header"><div><span>{active.number}</span><p>{active.family}</p></div><EditorialMark className="info-detail-mark" /><div><p>PRANCHA DE ORIENTAÇÃO</p><h3>{active.title}</h3></div></header>
          <p className="info-detail-lead">{active.lead}</p>
          <FolioVisual folioIndex={activeIndex} />
          <aside className="info-limit"><EditorialMark /><div><span>LIMITE DECLARADO</span><p>{active.limit}</p></div></aside>
          <p className="info-manuscript-reference"><EditorialMark /> <span>{active.manuscript}</span> <Link href={active.href}>Ler a seção <ArrowUpRight size={13} /></Link></p>
        </article>
      </section>

      <ArtifactIndex onFolioOpen={setActiveIndex} />

      <section className="info-next" aria-labelledby="info-next-title">
        <div><EditorialMark className="info-next-mark" /><p>O MAPA TERMINA ONDE O CASO COMEÇA</p><h2 id="info-next-title">Depois da prancha, a leitura volta ao registro.</h2></div>
        <div><p>As oito peças dão nomes às operações que o laboratório pede: recorte, pagador, medida, posto, ponto cego, grafo, caso e revisão. O laboratório permanece opcional; o manuscrito continua a fonte da formulação.</p><div className="info-next-links"><Link href="/lab">Abrir o laboratório <ArrowUpRight size={16} /></Link><Link href="/cave">Ler a caverna <GitFork size={15} /></Link><Link href="/cosmus">Ler o fólio do tempo <CircleDot size={15} /></Link></div></div>
      </section>

      <footer className="info-footer"><p>MAPA VISUAL DA GRAMÁTICA · FÓLIOS 01–08 · PRANCHAS DETERMINÍSTICAS</p><Link href="/" className="info-return">Retomar o manuscrito <ArrowUpRight size={15} /></Link></footer>
    </main>
  );
}
