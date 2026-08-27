# Plano editorial — Infográficos da Gramática do Movimento (`/info`)

**Estado:** fólios 01–06 implementados localmente; fólios 07–08 em construção.

## Princípio de leitura

A futura página não deve transformar a teoria em uma coleção de pôsteres. Sua função é oferecer **entradas de orientação** para o manuscrito: cada infográfico condensa uma operação, explicita seu limite e devolve o leitor à seção que carrega a formulação completa. O percurso deve preservar a disciplina central da obra: forma, moeda, troca, estatuto e revisão não se confundem, e nenhum diagrama é prova por si só.

O meio recomendado é uma rota estática, **`/info`**, composta por artefatos editoriais determinísticos em HTML/CSS e SVG acessível. Estruturas com relações formais — tipologia, topologia, matriz e árvore de postos — devem conservar fonte de dados legível e, quando fizer sentido, a mesma notação Mermaid/SVG que o manuscrito já usa. Ilustrações conceituais só entram como campo secundário, sem texto produzido por imagem e sem substituir rótulos, números, datas ou relações que precisem permanecer exatos.

## Arquitetura da rota

A página se organiza como uma sequência de oito pranchas, cada uma tratada como fólio de uma edição crítica: número, pergunta de leitura, visual principal, limite declarado e uma volta ao manuscrito. A margem fixa repete o aparelho existente — marca de recorte, progresso, filete e índice — e pode filtrar a leitura por três famílias: **forma**, **custo** e **revisão**.

| Fólio | Pergunta didática | Peça proposta | Base textual | Interação adequada |
|---|---|---|---|---|
| 01 | O que uma forma faz para existir? | **Tipologia travada**: evento, equilíbrio e fora do equilíbrio, com comportamento previsto e custo. | Introdução; Figura 1; Tabela 1 | Alternar o aspecto de leitura para mostrar por que a mesma forma pode mudar de classe. |
| 02 | Onde se paga uma persistência? | **Mapa do hospedeiro e da moeda**: hospedeiro → forma mantida → custo, com famílias de medida. | Seção 3.2; Figura 3; Tabela 2 | Selecionar uma moeda para revelar hospedeiro, medida, estatuto e proibição de câmbio. |
| 03 | O que a moeda permite concluir? | **Escada de estatutos**: medida sustentada, proxy, etiqueta, ordenação e ilustração, com quedas de posto. | Seções 3.2–3.3; Tabela 6; Apêndice C | Mover entre os três planos de mensurabilidade e ver promoção, permanência ou rebaixamento. |
| 04 | Quando uma troca pode ser chamada de identificada? | **Janela da cláusula de identificação**: troca declarada, observação separadora, ponto cego anterior e resposta possível. | Seção 3.1, pergunta 5; Seção 6.1 | Abrir um exemplo anotado que separa limite mapeado, falha de cláusula e deslocamento de troca. |
| 05 | Como o conhecimento se move sem virar escada? | **Topologia navegável** dos dez nós, sete movimentos, 22 instâncias e 32 trajetórias sob convenção declarada. | Seção 4; Figura 4; Tabelas 3, 4, 7 e 8 | Destacar um nó ou movimento e mostrar as transições permitidas e sua moeda por aresta. |
| 06 | O que a contagem verifica — e o que ela não prova? | **Sensibilidade das trajetórias**: 32, 36 e 43 como resultado de convenções diferentes sobre o mesmo grafo. | Seção 4.5; Apêndice B | Ligar e desligar convenções para expor a mudança de contagem, sem fazer da soma uma prova do sistema. |
| 07 | O que os seis casos mostram? | **Matriz de aplicações**: caso, forma, moeda, posto e veredito; cada coluna permanece em sua própria função. | Seção 5.7; Tabela 5 | Filtrar por domínio — epistêmico, linguístico ou institucional — e abrir a nota de limite de cada caso. |
| 08 | O que um instrumento honesto faz quando falha? | **Caderno de revisão**: quatro vereditos, data do ponto cego, cadeia de postos, razão, ressonância e carcaça legível. | Seções 6.1–6.3; Figura 5; Apêndice E | Percorrer uma entrada de catálogo da observação ao reexame, com o registro de emenda ou perda de posto. |

## Narrativa de página

A abertura começa com uma frase de orientação: **“A teoria não pede que se creia no diagrama; pede que se veja o que cada forma custa e onde uma leitura deve ceder.”** Em seguida, os fólios 01 a 04 formam a gramática mínima do caso: recorte, hospedeiro, moeda, troca, limite. Os fólios 05 e 06 mostram por que o processo de conhecer exige grafo e convenção auditável. O fólio 07 devolve esse dispositivo aos seis casos sem repetir a prosa de cada um. O fólio 08 fecha pela revisão, evitando que a página termine em uma promessa de certeza.

O laboratório **`/lab`** entra como continuação opcional depois do fólio 08, não como pré-requisito. Cada prancha terá uma ligação precisa: “ler a seção”, “ver a tabela”, “abrir o laboratório com este ponto de partida”. A página principal do manuscrito passa a oferecer dois caminhos de orientação: **Mapa visual da teoria** e **Laboratório de movimentos**.

## Linguagem visual e acessibilidade

A página conserva o sistema **Caderno de Margem**: papel branco quebrado, carvão, azul-petróleo `#0F4C5C`, Source Serif 4 para argumentos e IBM Plex Sans para metadados. O azul-petróleo indica orientação, relações e estados ativos; não será usado como preenchimento atmosférico. A marca de recorte aparece na abertura de cada fólio, nos marcos de bifurcação e no retorno à leitura.

Os visuais devem funcionar sem cor isoladamente. Cada relação terá rótulo textual, legenda persistente e ordem de leitura no DOM; componentes SVG receberão título e descrição; estados interativos terão equivalente em texto; a matriz de aplicações manterá versão tabular responsiva. Nenhum dado será inventado, simplificado em número novo ou exibido como validação externa.

## O que deliberadamente não será produzido

O plano preserva três recusas já registradas no Apêndice E. Não haverá um fluxograma que reduza os vereditos a escolha automática, pois a Tabela 6 já sustenta o dispositivo e a data do mapa muda sua leitura. Não haverá um diagrama ornamental das sete perguntas, pois a lista já é o instrumento e sua ordem é convenção de exposição. Não haverá fórmula geral de custo ou gráfico de conversão entre moedas, porque a terceira regra proíbe taxa de câmbio e soma entre moedas distintas.

Também ficam fora desta fase retratos de autores, cronologias biográficas, dados empíricos ainda não produzidos, animações decorativas, pontuações de autoridade e qualquer linguagem de “prova visual”. As imagens devem orientar o argumento, não aumentar sua força por aparência.

## Ordem de implementação recomendada

| Etapa | Entrega | Critério de aceite |
|---|---|---|
| 1 | Esqueleto da rota, índice e oito folios vazios | A rota funciona como segunda modalidade da edição, responsiva e navegável. |
| 2 | Fólios 01–04 | Tipologia, moeda, posto e cláusula podem ser lidos sem abrir o manuscrito; cada peça declara seu limite. |
| 3 | Fólios 05–06 | A topologia, a convenção de contagem e a sensibilidade são verificáveis pela matriz e não só pela imagem. |
| 4 | Fólios 07–08 | Casos, vereditos e retrospectiva retornam às seções exatas e não prometem validação externa. |
| 5 | Revisão de acessibilidade e ensaio de primeira leitura | Um visitante reconhece a diferença entre descrição, derivação, ordenação e ilustração sem encontrar texto ou dados inventados. |

## Decisão de escopo

A primeira implementação começa pelos fólios 01–04, que dão ao leitor as condições de entender as peças posteriores. As infografias não substituem o manuscrito nem alteram o laboratório; apenas tornam mais legível o que cada percurso já declara.
