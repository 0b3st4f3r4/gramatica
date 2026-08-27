# Caderno de Margem: especificação BDD legível dos casos de uso da página de laboratório.
Funcionalidade: decidir uma publicação com evidência, política e custo
  Para tornar uma decisão reconstruível
  Como pessoa responsável por uma publicação
  Quero saber qual regra foi usada, quais provas estavam presentes e por que a decisão foi tomada

  Cenário: publicar uma versão com prova completa e custo dentro do limite
    Dado que o caso possui commit, lockfile e build
    E que o custo total é 0,62 compute-credit
    Quando a regra de publicação é executada
    Então a decisão é "accept"
    E não há motivo de recusa

  Cenário: reter um custo acima do limite
    Dado que o caso possui as três provas exigidas
    E que o custo total é 1,75 compute-credit
    Quando a regra de publicação é executada
    Então a decisão é "deny"
    E o motivo contém "COST_LIMIT_EXCEEDED"
    E existe uma rota de reexame

  Cenário: suspender decisão quando falta evidência
    Dado que o caso não possui lockfile
    Quando a regra de publicação é executada
    Então a decisão é "indeterminate"
    E a evidência ausente é declarada como "lockfile"

  Cenário: atestar a sequência da sessão
    Dado que dois casos foram executados
    Quando a sessão é exportada
    Então o atestado contém a cabeça da razão encadeada
    E deixa explícito que a prova é local e não é assinatura de identidade

  Cenário: completar um caderno pelas sete perguntas
    Dado que a pessoa declara forma, observador, nomeação, horizonte, hospedeiro, moeda, troca, escala e refluxo
    Quando aplica a política local
    Então o portão pode avaliar evidências e custo
    E a razão guarda o caderno junto da decisão

  Cenário: separar a decisão do posto da derivação
    Dado que um caso satisfaz a política operacional
    E que sua moeda é declarada como metáfora controlada
    Quando o caso é executado
    Então a decisão operacional pode ser "accept"
    Mas o posto da derivação é "ordering"

  Cenário: manter o portão aberto quando o caderno está incompleto
    Dado que faltam declarações obrigatórias das sete perguntas
    Quando a política é executada
    Então a decisão é "indeterminate"
    E o motivo contém "NOTEBOOK_INCOMPLETE"

  Cenário: calcular o digest de uma evidência local
    Dado que uma pessoa seleciona um arquivo no próprio dispositivo
    Quando o envelope de evidências é criado
    Então o caderno registra nome, metadados e digest SHA-256
    E o conteúdo do arquivo não é enviado nem persistido

  Cenário: declarar o mapa de cegueira de um proxy
    Dado que a moeda é de medida difícil e usa proxy
    Quando a pessoa descreve fonte, recorte, direção de erro, troca não vista e data anterior ao teste
    Então o caso pode alcançar previsão por contorno
    Mas sem esse mapa completo o posto não sobe acima de ordenação

  Cenário: impedir ponto cego declarado a posteriori
    Dado que o mapa de cegueira tem data posterior ao evento
    Quando a pessoa executa a política local
    Então o portão permanece "indeterminate"
    E o posto da derivação é "ordering"

  Cenário: reexaminar um limite empírico
    Dado que a previsão encontra um vazamento dentro do ponto cego declarado antes do resultado
    Quando a pessoa registra o veredito "empirical-limit"
    Então a razão preserva a decisão anterior
    E a derivação desce um posto

  Cenário: registrar falha da cláusula
    Dado que o vazamento persiste fora do ponto cego declarado
    Quando a pessoa registra o veredito "clause-failure"
    Então o catálogo preserva a entrada datada
    E a derivação fica revogada

  Cenário: ler uma trajetória de decisões
    Dado que duas decisões foram registradas nesta sessão
    E uma delas recebeu reexame por deslocamento da troca
    Quando a matriz de trajetória é aberta
    Então cada posição mostra forma, moeda, portão e posto próprios
    E a ruptura aparece sem transformar a sequência em um placar

  Cenário: manter moedas em carteiras paralelas
    Dado que tempo de espera e reparo possuem unidades distintas
    Quando a pessoa registra as duas carteiras
    Então cada moeda conserva escopo, unidade e quantidade próprios
    E o laboratório não cria conversão ou total geral automático

  Cenário: confrontar um pacote de outro aplicador
    Dado que a pessoa escolhe uma atestação JSON exportada
    Quando o pacote possui tipo, política e razão reconhecíveis
    Então o laboratório confronta os digests de política e cabeça da razão
    Mas não incorpora o pacote externo como prova da sessão local

  Cenário: recusar um pacote não reconhecido
    Dado que o arquivo escolhido não contém uma atestação compatível
    Quando a leitura local termina
    Então o laboratório informa a incompatibilidade
    E não envia, armazena ou absorve o conteúdo do arquivo

  Cenário: bifurcar uma trajetória
    Dado que uma decisão já ocupa uma posição na razão
    Quando a pessoa declara uma hipótese alternativa a partir dessa posição
    Então o laboratório abre um ramo com a cabeça de origem e o motivo declarados
    E o tronco anterior não é reescrito

  Cenário: relatar divergências entre trajetórias
    Dado que uma atestação importada declara política, razão, decisão, posto e moeda
    Quando o laboratório a confronta com a sessão local
    Então cada coincidência ou divergência aparece por campo
    E moedas distintas não são convertidas nem somadas

  Cenário: persistir uma sessão por escolha explícita
    Dado que o histórico local está desativado por padrão
    Quando a pessoa ativa a opção e registra a sessão permitida
    Então o navegador guarda somente razão, declarações, digests, ramos e carteiras
    E não guarda conteúdo de arquivos, pacotes importados ou credenciais

  Cenário: apagar memória local
    Dado que uma sessão permitida foi registrada nesta origem
    Quando a pessoa apaga o histórico e retira o consentimento
    Então o registro local é removido
    E o laboratório volta a não persistir nada por padrão

  Cenário: filtrar uma trajetória ramificada
    Dado que o tronco e um ramo possuem posições declaradas
    Quando a pessoa escolhe um ramo na leitura da matriz
    Então a matriz mostra somente as posições desse ramo
    E a posição de origem comum continua declarada

  Cenário: exportar um relatório de divergências
    Dado que uma atestação local e outra importada foram confrontadas
    Quando a pessoa exporta o relatório de divergências
    Então o arquivo contém somente campos comparados, seus limites e metadados declarados
    E não incorpora o pacote importado como prova

  Cenário: declarar prazo de reexame
    Dado que uma decisão já foi registrada
    Quando a pessoa declara uma data-limite e sua nota
    Então o prazo aparece como pendente até a data
    E a decisão anterior não é alterada

  Cenário: vencer ou cumprir prazo de reexame
    Dado que existe um prazo de reexame declarado
    Quando a data passa sem uma entrada de reexame posterior
    Então o prazo é marcado como vencido
    Mas se um reexame for registrado a tempo
    Então o prazo é marcado como reexaminado

  Cenário: comentar uma divergência declarada
    Dado que um campo do pacote local diverge do pacote confrontado
    Quando a pessoa anota o que a diferença sustenta ou deixa aberto
    Então o comentário é datado e ligado àquele campo
    E o pacote confrontado não se torna prova da razão local

  Cenário: exportar um recorte de trajetória
    Dado que a matriz está filtrada por um ramo
    Quando a pessoa exporta o recorte
    Então o pacote declara o ramo, a origem e apenas as posições visíveis
    E declara que não substitui a razão completa

  Cenário: arquivar um ramo
    Dado que um ramo possui origem e posições declaradas
    Quando a pessoa registra o motivo de seu encerramento
    Então o ramo é marcado como arquivado sem apagar sua origem ou posições
    E novas decisões naquele ramo permanecem bloqueadas

  Cenário: reabrir um ramo arquivado
    Dado que um ramo foi arquivado com motivo e data
    Quando a pessoa declara uma nova condição para reabri-lo
    Então o ramo volta a receber decisões
    E o motivo de arquivamento permanece em sua história datada

  Cenário: indexar atestações apenas durante a sessão
    Dado que a pessoa exporta uma atestação do caderno
    Quando a exportação termina
    Então o índice mostra somente os metadados da atestação gerada
    E o índice desaparece ao limpar ou recarregar a sessão

  Cenário: filtrar o confronto por divergência ou campo
    Dado que o confronto possui campos coincidentes e divergentes
    Quando a pessoa escolhe somente divergências ou um campo declarado
    Então o relatório mostra apenas o recorte escolhido
    E comentários e campos ocultos permanecem preservados no confronto

  Cenário: abrir uma sessão efêmera para uma futura chamada de agente
    Dado que a pessoa informa uma API key apenas para a sessão atual
    Quando a sessão é aberta
    Então o estado de interface não contém a API key
    E a chave não é gravada no armazenamento local nem no atestado

  Cenário: expirar uma sessão inativa
    Dado que uma sessão aberta permanece inativa por vinte minutos
    Quando o prazo de inatividade é alcançado
    Então a sessão fica expirada
    E a API key em memória é descartada
    E uma nova abertura exige que a chave seja informada novamente
