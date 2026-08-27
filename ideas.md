# Direção de design — Gramática do Movimento

## Três abordagens iniciais

| Tema | Introdução breve | Probabilidade |
|---|---|---:|
| **Caderno de Margem** | Uma leitura de artigo como caderno de pesquisa: papel branco, coluna de leitura generosa e uma margem funcional que acompanha o argumento sem competir com ele. | 0.06 |
| **Mapa de Arestas** | Um ensaio visualmente orientado por conexões: índice lateral, linhas discretas e uma presença mais diagramática para refletir a topologia do texto. | 0.04 |
| **Arquivo Tipográfico** | Uma edição quase bibliográfica, austera e monoespacial nos metadados, em que a hierarquia nasce de regras, recuos e densidade tipográfica. | 0.08 |

## Abordagem escolhida — Caderno de Margem

### Movimento de design

**Editorial acadêmico contemporâneo**, com a clareza de uma edição crítica digital e o silêncio visual de uma folha de papel bem composta.

### Princípios centrais

1. O manuscrito é o protagonista: leitura longa, contraste alto e largura de coluna deliberadamente limitada.
2. A navegação serve à argumentação: índice lateral, progresso de leitura e âncoras, sem cartões promocionais nem chamadas artificiais.
3. O diagrama permanece estrutural e legível: Mermaid é renderizado no navegador, dentro de superfícies claras e responsivas.
4. O adorno só aparece quando registra uma função: filetes, numeração, metadados e marca gráfica comunicam estrutura, não decoração.

### Filosofia de cor

O branco quebrado sustenta a sensação de página impressa, enquanto carvão profundo assegura leitura contínua. O **azul-petróleo #0F4C5C** é reservado para orientação, títulos, links e estados ativos: uma cor de método, não de ornamento.

### Paradigma de layout

Em telas largas, uma faixa lateral fixa abriga a marca, o índice e o progresso; o texto corre numa coluna editorial deslocada para a direita, em vez de um bloco central genérico. Em telas pequenas, a faixa torna-se cabeçalho compacto e o índice abre como painel, preservando a prioridade do texto.

### Elementos de assinatura

1. **Filete de fluxo**: uma linha vertical azul-petróleo que acompanha o conteúdo e marca a posição de leitura.
2. **Marca de recorte**: símbolo gráfico abstrato de loop e seta, usado no cabeçalho e favicon.
3. **Notas de margem**: pequenos rótulos para seção, data e estatuto do manuscrito.

### Filosofia de interação

A interação é discreta e editorial: o leitor pode abrir o índice, ir a qualquer seção, copiar um link de âncora e retornar ao topo. O estado ativo informa onde a leitura está, sem competir com o manuscrito.

### Animação

O painel lateral e o índice móvel usam transições de opacidade e deslocamento de até 180 ms. Mermaid aparece sem animação de traços para evitar distração. Todas as transições não essenciais respeitam `prefers-reduced-motion`.

### Sistema tipográfico

**Source Serif 4** conduz o corpo do ensaio, com altura de linha ampla e contraste de impressão. **IBM Plex Sans** organiza navegação, metadados, tabelas e títulos. Títulos usam caixa alta moderada, espaçamento entre letras contido e peso 600; o corpo não usa Inter.

### Essência de marca

**Uma edição digital navegável da Gramática do Movimento para leitores que preferem argumento aberto a interface ruidosa.** Personalidade: rigorosa, sóbria, permeável.

### Voz da marca

Headlines nomeiam o que o texto faz; microcopy explica a próxima ação com precisão.

> “O fluxo não cabe numa página; a leitura pode acompanhá-lo.”

> “Abrir o índice e retomar a aresta em curso.”

### Wordmark e logotipo

O wordmark usa uma composição serrifada curta, **GRAMÁTICA / DO MOVIMENTO**, ancorada a uma marca sem texto: um círculo aberto cortado por uma seta ascendente, aludindo ao recorte de fluxo e ao retorno revisável.

### Cor de marca

**Azul-petróleo de método — #0F4C5C.**

## Style Decisions

- A margem é um aparato editorial contínuo: marca, metadados, índice, progresso e filete vertical pertencem ao mesmo sistema de orientação.
- O azul-petróleo é reservado a sinais de orientação: fluxo, seção ativa, âncoras, filetes, headings e estados de navegação.
- O wordmark permanece uma composição editorial — **GRAMÁTICA / DO MOVIMENTO** — sempre acompanhada pela marca de loop e seta.
- Diagramas, tabelas e notas compartilham superfícies de papel claro, regras precisas e rótulos sans-serif discretos.
- A margem da edição é um contínuo visual, e não somente uma barra lateral: a linha de fluxo, a marca, os metadados, o índice e o progresso devem parecer partes da mesma peça editorial.
- A rota do laboratório é uma segunda modalidade da mesma publicação; nela, a marca de recorte substitui ícones genéricos nas posições de maior hierarquia.
- A densidade do manuscrito pode ser maior, mas ambas as rotas preservam papel claro, filetes azul-petróleo, rótulos em caixa alta, serifa de leitura e tom sóbrio.
- O laboratório é um instrumento editorial: controles aparecem como evidência regrada e superfícies anotadas, não como cartões de produto.
- A marca de recorte ocupa os momentos de maior hierarquia no laboratório — abertura de sessão, aplicação de regra, decisão e atestação — enquanto ícones utilitários permanecem auxiliares.
- O azul-petróleo atua como sinal de método: filetes, orientação, estado ativo, decisão e ação primária; preenchimentos secundários mantêm-se quase neutros.
- As oportunidades do laboratório são apresentadas como um registro de meios — prova, transformação, endereço, custo, tempo e contestação — e não como uma lista de funcionalidades promocionais.
- Os capítulos do manuscrito começam como marcos de edição: metadado sans-serif, regra azul-petróleo e título serifado antecedem o corpo mais denso.
- A espinha de leitura deve enunciar sua posição presente na margem, para que marca, índice, progresso e seção ativa apareçam como uma única aparelhagem editorial.
- No laboratório, os casos de uso mantêm a forma de registros: número, caso, evidência e efeito esperado organizados por filetes, sem cartões autônomos.
- O aparelho de margem do laboratório é contínuo: selo, filete, posições de caso, prova, regra e razão formam uma única espinha de orientação ao longo do caderno.
- A marca de recorte substitui ícones genéricos nos atos de declarar evidência, aplicar política, confrontar atestação e exportar o caderno; ícones persistem apenas em utilidades secundárias.
- Campos de política, evidência, custo, decisão, reexame e trajetória devem parecer registros anotados de uma edição crítica, governados por faixas, filetes e rótulos funcionais.
- Na rota do laboratório, a espinha fixa reúne marca, posição e atalhos de seção; ela orienta a leitura sem disputar espaço com o caderno nem aparecer no celular.
- As grandes seções repetem uma cadência editorial: filete de método, metadado, afirmação serifada e coluna explicativa; o percurso deve parecer uma única publicação, não painéis independentes.
- Dentro do caderno, os atos operativos obedecem a fólios sequenciais — declaração, prova, envelope, separação, decisão e reexame — ligados ao mesmo filete de método; controles são subordinados a esses registros.
- A marca de recorte aparece em escala ampliada nos atos de abertura e nos marcos de alta consequência — declaração, decisão, exportação e atestação —, enquanto a tipografia e os rótulos preservam a hierarquia de leitura.
- A espinha do laboratório reúne, em uma só peça, marca de recorte, posição em curso, atalhos de seção, régua de progresso e filete; uma linha isolada não constitui aparelho de margem.
- Controles da prática assumem a aparência de fólios anotados de uma edição crítica — sequenciados, rotulados e regrados — e jamais a de campos soltos ou cartões de produto.
- O masthead **GRAMÁTICA / DO MOVIMENTO** funciona como identidade de publicação e a marca de recorte cresce nos atos de abertura, declaração, decisão, exportação e atestação.
- A rota `/cave` lê a alegoria como caderno de transposição: a cena primária aparece por camadas de sombra, suporte, virada e retorno; cada camada devolve uma pergunta da Gramática e declara o limite da analogia.
- O diagrama da caverna permanece determinístico em SVG editorial, com figuras abstratas, alto contraste e rótulos no DOM; o azul-petróleo orienta a passagem, mas não converte luz, dor ou retorno em sinal automático de verdade.
- Na rota `/cave`, a margem nomeia a camada em curso — sombra, suporte, virada ou retorno — e liga marca, filete, régua de progresso e índice de fólio numa única espinha de transposição.
- A marca de recorte ganha escala nos atos de abertura, limite, transposição e retorno; os quatro estados da alegoria são fólios sequenciais e anotados, não abas de produto.
- Todas as rotas exibem a margem como aparelho completo: marca de recorte, wordmark ou título de rota, posição presente, índice ou régua de progresso e filete azul-petróleo pertencem à mesma peça editorial.
- Capítulos do manuscrito funcionam como limiares de fólio: marca de recorte, metadado em caixa alta, regra azul-petróleo, título serifado e pausa de papel antecedem a leitura densa.
- Diagramas, tabelas e registros mantêm superfícies próximas ao papel, filetes e rótulos de edição crítica; grandes lavagens de azul-petróleo não substituem a hierarquia tipográfica.
- A rota `/cosmus` organiza matéria, horizonte e tempo como um fólio temporal: caderno, lápis e borracha aparecem em SVG determinístico e em três posições de leitura, sem reduzir revisão a apagamento.
- O azul-petróleo fixa a linha temporal, a margem e o fólio em curso; um tom de grafite quente pertence apenas ao gesto material do lápis e da borracha.
- Figuras fechadas organizam relações comparáveis — posição, sequência, bifurcação e registro. Traço aberto, borda irregular, arco e linha interrompida indicam suporte, gesto, campo, custo, horizonte e revisão, que excedem a figura.
- A rota principal é a expressão mais completa da edição: sua margem reúne marca de recorte, masthead, posição, índice, progresso e filete como um único aparelho antes da leitura contínua.
- Cada capítulo do manuscrito abre como fólio com marca, metadado, regra azul-petróleo, título serifado e pausa de papel. Os controles do laboratório mantêm bordas de registro, círculos de posição e sequência, em vez de superfícies de produto.
- As leituras derivadas conservam a espinha da edição, mas cada uma possui uma modalidade própria: a caverna reaparece por sombra, suporte, virada e retorno; o fólio temporal por matéria, horizonte, inscrição e correção. A marca de recorte orienta essas passagens, sem funcionar como ornamento.
- A rota `/info` é um caderno de orientação, não uma parede de pôsteres: cada fólio combina pergunta, estrutura determinística, legenda de alcance e remissão exata ao manuscrito.
- Tipologia, hospedeiro, estatuto e cláusula usam geometrias próprias — linha de propagação, circuito, escada e janela — sem converter seu desenho em prova; a margem fixa mantém o fólio em curso e sua família de leitura.
- Em `/info`, a margem nomeia sempre o fólio e sua família, ligando marca, índice, régua e filete; as quatro entradas se apresentam como registros anotados de pergunta, recorte e limite, e não como controles de produto.
- Nos pontos de orientação, limite e retorno ao manuscrito, a marca de recorte substitui ícones genéricos. Ícones utilitários ficam restritos aos vínculos secundários.
- Os fólios 05–06 de `/info` conservam a distinção entre grafo e convenção: os dez nós e as arestas declaradas usam uma topologia de pontos e linhas; 32, 36 e 43 aparecem como três cadernos de contagem, sem barras de desempenho, medidores ou placar.
- A rota `/info` repete a cadência de um caderno encadernado: a margem anuncia fólio em leitura, família e régua; cada entrada conserva número, pergunta, recorte e limite antes da prancha aberta. O masthead tem presença de publicação, não de barra utilitária.
- Em `/info`, uma ficha de fólio no corpo repete o aparelho de margem para que posição, família, régua e marca permaneçam presentes mesmo quando a margem fixa se recolhe. As oito entradas formam registros em duas colunas; os vínculos finais se leem como remissões de caderno, não como um hub de navegação.
- A abertura de `/info` também porta o selo de publicação e uma régua de oito posições; linha, circuito, escada, janela, grafo, caderno, matriz e revisão aparecem como famílias nomeadas das pranchas, nunca como ilustrações intercambiáveis.
- Os fólios 07–08 terminam o mapa pela matéria dos casos e pela revisão: a matriz conserva linhas e colunas para comparações declaradas; o caderno de vereditos usa entradas datadas e cadeia de postos, sem árvore de decisão, nota de desempenho ou validação exterior.
