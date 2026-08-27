# Plano de evolução do Laboratório de Movimentos Verificáveis

> **Base de leitura:** releitura integral de *Gramática do Movimento*, incluindo a topologia, as seis aplicações, a cadeia de postos, o catálogo de falhas, os planos de mensurabilidade e a retrospectiva do caderno. Este plano é uma ordenação de implementação local; não pretende converter a gramática em uma prescrição automática.

## Princípio de desenho

O laboratório não deve se tornar uma máquina que pronuncia verdades, nem uma vitrine de fluxos genéricos. Sua função é oferecer um **caderno de prática**: cada caso torna explícitos a forma recortada, o hospedeiro, a moeda, a troca, a prova disponível, o estatuto da derivação e o caminho de retorno. A interface deve permitir verificar os movimentos próximos do bit — arquivo, digest, evidência, transformação, endereço, tempo, custo e revisão — antes de delegar qualquer parte a um agente.

| Categoria do manuscrito | Presença atual | Consequência para o laboratório |
|---|---|---|
| Sete perguntas | Parcial: prova, custo e decisão aparecem, mas sem forma, aspecto, hospedeiro, troca, escala e refluxo. | Criar o **caderno de caso** guiado pelas sete perguntas, com campos curtos e estatutos explícitos. |
| Moeda, hospedeiro e proibição de câmbio | Há um único `compute-credit` dividido em componentes. | Manter somas apenas dentro de uma moeda declarada e criar carteiras paralelas para moedas diferentes, sem total geral. |
| Proxy e ponto cego | Ausentes no caso executável. | Todo proxy deve nascer com fonte, recorte, direção de erro, troca não vista e data anterior ao teste. |
| Topologia: nós, arestas e trajetórias | O histórico é linear; não declara nó, aresta, movimento nem reentrada. | Registrar cada passagem como aresta custeada e validar sua admissibilidade contra a matriz, sem duplicar um fluxograma ornamental. |
| Estatutos e cadeia de postos | O resultado de portão mistura-se à aparência de conclusão. | Separar **decisão operacional** de **posto da derivação**: uma ação pode ser admitida e ainda produzir apenas ilustração ou ordenação. |
| Divergência, observação separadora e limite | A prova faltante gera indeterminação, mas não há confronto entre leituras. | Declarar a observação separadora antes da execução; permitir coexistência de leituras quando ela não existir. |
| Vazamento, quatro vereditos e perda de posto | O histórico não pode receber objeção nem corrigir descrição. | Criar reexame que preserva a entrada anterior e registra artefato, limite, falha da cláusula ou deslocamento de troca. |
| Caderno, data e auditabilidade | A razão é encadeada na sessão e exportável. | Ampliar o atestado para um pacote local de caso, decisão, revisão e digests; jamais converter hash em identidade ou auditoria externa. |
| Planos de mensurabilidade | Ausentes. | Tornar a metáfora controlada uma escolha visível, com plano, critério de promoção, risco e destino de falha. |

## Diagnóstico do módulo atual

O módulo atual já faz quatro coisas valiosas: fixa uma política antes de executar; conserva um vetor de custo numa moeda única; encadeia as decisões por digest; e distingue aceite, recusa e insuficiência de prova sem enviar dados ao exterior. Esses elementos devem permanecer como o núcleo de um primeiro portão operacional.

O desvio principal é semântico. Hoje, “aprovado” pode soar como confirmação de uma derivação, quando a interface demonstra somente que um exemplo simulado passou por uma política local. O texto reserva “previsão”, “ordenação” e “ilustração” para forças diferentes e exige que a perda de posto seja visível. O laboratório precisa, portanto, separar o que uma regra permite fazer do que um caso autoriza afirmar.

## Novas funções priorizadas

| Prioridade | Função | Operação local | Critério de conclusão |
|---|---|---|---|
| P0 | **Caderno de caso** | Formulário progressivo para forma, aspecto, horizonte, hospedeiro, moeda, troca, escala e refluxo. | Nenhuma execução ocorre sem declarar o que o caso é, quem paga e em que moeda. |
| P0 | **Envelope de evidências** | O usuário seleciona arquivos locais ou referências; o navegador calcula digest, registra nome, tipo, tamanho e data. | A razão guarda digests e metadados, nunca o conteúdo do arquivo nem uma chave. |
| P0 | **Dois resultados, não um** | Mostrar lado a lado a decisão do portão — admitido, retido ou em aberto — e o posto — previsão por número, contorno, ordenação ou ilustração. | A interface não chama um aceite operacional de confirmação epistêmica. |
| P0 | **Moedas sem câmbio** | Criar uma carteira por moeda, com hospedeiro e unidade próprios; o resumo mostra vetores paralelos, não total universal. | A soma só ocorre entre componentes da mesma moeda e toda agregação declara a regra. |
| P1 | **Mapa de cegueira do proxy** | Para moeda de medida difícil, solicitar fonte, recorte, ponto cego, direção do erro e data de declaração. | Sem mapa anterior, o caso desce para ordenação ou ilustração conforme a regra declarada. |
| P1 | **Observação separadora** | Campo para comportamento previsto, comparação, contorno ou número, e condição de revisão. | A derivação só recebe força de previsão quando a observação é administrável e declarada antes do resultado. |
| P1 | **Reexame e catálogo de falhas** | Registrar objeção, evidência nova ou retirada; classificar o resultado como artefato, limite, falha da cláusula ou deslocamento. | A entrada anterior permanece íntegra, a data é preservada e a eventual descida de posto aparece. |
| P1 | **Linha de tempo de manutenção** | Organizar proposta, prova, execução, reexame e refluxo como entradas datadas. | O caso mostra duração e reentrada, em vez de parecer decisão isolada. |
| P2 | **Trajetória verificável** | Permitir escolher nós e arestas e conferir localmente a matriz de adjacência; identificar indução, dedução, abdução, cisão, fusão, retroalimentação e elevação. | O percurso inválido é explicado e o válido é exportado como sequência de arestas custeadas. |
| P2 | **Dois aplicadores, sem servidor** | Exportar um pacote de caso; outro navegador o importa e devolve uma leitura. O primeiro compara classificação, moeda, proxy e estatuto. | Convergência e divergência são registradas sem alegar auditoria externa automática. |
| P2 | **Planos de mensurabilidade** | Converter cada metáfora controlada em um cartão de plano: proxy, fonte, critério, risco, destino e data de reexame. | A promoção, a permanência e o rebaixamento ficam rastreáveis e não dependem de promessa verbal. |

## Melhorias de precisão e experiência

| Melhoria | Problema que corrige | Direção de interface |
|---|---|---|
| Trocar “provas simuladas” por “evidências de cenário” enquanto os exemplos forem didáticos. | “Prova” sugere validação que o cenário fixo não realiza. | Distinguir exemplo guiado, caso local e pacote importado. |
| Tornar o limiar e o reexame campos da política, não constantes implícitas. | O prazo de sete dias e o teto atual parecem naturais, mas são escolhas. | Mostrar versão, digest, vigência e regra de exceção antes da execução. |
| Mostrar a alocação de custo por aresta. | O custo hoje aparece como condição do caso, não como custo da transformação. | Cada registro informa movimento, hospedeiro, moeda, componente e pagador. |
| Acrescentar endereços estáveis locais. | O identificador atual é fixo e não diferencia casos criados pelo visitante. | Usar URN local por caso e digest de conteúdo para retomada e comparação. |
| Fazer da exportação um pacote legível. | O JSON atual é íntegro, mas pouco pedagógico. | Incluir versão de esquema, glossário mínimo, política, caso, razão, reexames e aviso de escopo local. |
| Explicitar a ausência de medida. | “Ainda não decidido” resolve um portão, mas não declara metáfora, proxy ou limite de resolução. | Usar etiquetas visíveis: mensurável, proxy declarado, metáfora controlada, limite de resolução. |

## Remoções e desativações recomendadas

| Remoção ou redução | Razão |
|---|---|
| Manter a função de agente, entrada de API key e chamadas externas fora da rota e do pacote público enquanto não houver deliberação específica. | O foco atual é o registro, não a delegação; agente não deve antecipar a clareza do instrumento. |
| Remover a equivalência implícita entre “aprovado” e resultado epistêmico favorável. | O portão é uma regra operacional; a força da derivação pertence à cadeia de postos. |
| Retirar o prazo fixo de sete dias como comportamento universal. | Tempo de reexame deve ser declarado pela política do caso, não escondido no motor. |
| Retirar o “total” como linguagem geral quando entrar mais de uma moeda. | A regra proíbe câmbio; um total só é legítimo dentro da mesma moeda e regra de alocação. |
| Não acrescentar fluxograma de vereditos ou diagrama das sete perguntas. | O manuscrito já recusou essa duplicação: a Tabela 6 e a lista exercem a função de decisão sem repetição ornamental. |
| Não prometer auditoria externa, identidade criptográfica ou armazenamento durável. | O atestado local mostra integridade de sessão; não substitui segundo aplicador, procedência remota ou autoridade. |

## Sequência de implementação recomendada

**Ciclo 1 — Caso e estatuto.** Substituir os cenários fechados por um modo guiado de criação de caso, preservando os três exemplos como material didático. Introduzir forma, aspecto, hospedeiro, moeda e troca; separar decisão operacional de força da derivação; remover o prazo oculto.

**Ciclo 2 — Prova e custo.** Criar o envelope local de evidências com digest; permitir carteiras de moeda paralelas e custos por aresta; acrescentar a política como objeto versionado, legível e exportável.

**Ciclo 3 — Revisão e limite.** Incluir observação separadora, mapa de cegueira, reexame e catálogo de falhas. Esse é o ciclo que permite ao laboratório cumprir a exigência mais própria do manuscrito: aceitar uma correção que muda a descrição e, quando necessário, perde posto.

**Ciclo 4 — Trajetória e alteridade.** Introduzir a escrita de trajetórias contra a matriz do Apêndice B e o intercâmbio manual de pacotes entre dois aplicadores. Nenhuma convergência será chamada de validação externa; ela será registrada como o que é, uma comparação local entre leituras independentes.

## Condições de aceitação do próximo ciclo

O primeiro ciclo estará pronto quando um visitante puder criar um caso sem sair do navegador, declarar forma, hospedeiro, moeda e troca, executar uma política versionada e entender em tela que o resultado operacional não equivale automaticamente a uma previsão. O pacote exportado deverá reconstituir o caso, os digests, a regra e a razão sem conter conteúdo sensível ou alegação de identidade.

O laboratório continuará sem agentes, API keys, servidor, conta ou envio de dados. A decisão de reintroduzir automação fica posterior aos quatro ciclos, quando a aplicação local puder declarar, antes de delegar, aquilo que um agente passaria a fazer em seu nome.
