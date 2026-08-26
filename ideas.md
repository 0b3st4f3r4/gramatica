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
