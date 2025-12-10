


Boa tarde a todos. Meu nome é Felipe Malacarne e vou apresentar meu Trabalho de Conclusão de Curso, intitulado *ValorizeAI: Documentação e Validação de uma Arquitetura Serverless Elasticamente Gerenciada*.
Esse trabalho foi desenvolvido sob orientação do professor Marcos André Lucas, no curso de Ciência da Computação da URI Erechim

A ideia central é avaliar, na prática, como uma arquitetura moderna baseada em serviços gerenciados em nuvem — que escalam sob demanda e cobram apenas pelo uso — se comporta sob carga intensa em uma aplicação web real, com cargas variáveis.

**SLIDE 2 — Sumário**

A apresentação está organizada em quatro partes:
primeiro, a **introdução**, onde apresento o problema e a motivação;
depois a **metodologia**, incluindo a arquitetura do sistema e como os testes foram conduzidos;
na sequência, os **resultados** dos cenários de carga;
e por fim, as **conclusões** e os trabalhos futuros.

**SLIDE 3 — Contexto e Motivação**

O contexto deste trabalho são **aplicações web modernas**, como plataformas colaborativas, e-commerces, APIs e sistemas financeiros, que convivem com **tráfego variável**, exigem **baixa latência**, **forte consistência** e alta disponibilidade.
Para lidar com esse cenário, cresce o uso de arquiteturas **elásticas** . Elas escalam automaticamente quando há demanda, e reduzem — até mesmo a zero — quando o tráfego desaparece, evitando custo ocioso.

Por outro lado, conforme esses sistemas ficam mais distribuídos, aumenta a necessidade de **observabilidade**: logs, métricas, traces e testes reprodutíveis.
A questão central passa a ser: *essa arquitetura realmente entrega o desempenho esperado quando é pressionada por carga real?*

O ValorizeAI entra como um caso real para estudar essa relação entre elasticidade e observabilidade em cenários de cargas variáveis em aplicações web em geral.

---

**SLIDE 4 — Problema, Lacuna e Pergunta de Pesquisa**

Quando a gente olha para a literatura, existem vários trabalhos bons, mas quase sempre olhando **um pedaço** do problema:
– comparação entre FaaS e CaaS;
– estudos de diferentes filas, como RabbitMQ e Kafka;
– comparações entre ferramentas de Infraestrutura como Código;
– ou estudos de desempenho focados em uma única API.

O que praticamente **não aparece** são validações **integradas**, de ponta a ponta, em um sistema real que combine tudo isso: containers gerenciados, filas assíncronas, WebSockets, cache, banco relacional e SRE.

Então a **pergunta central** do trabalho é:
*‘Como uma arquitetura híbrida e elástica, composta por Cloud Run, Redis, PostgreSQL, Filas e WebSockets dedicados, se comporta sob condições intensas de carga, e como esse comportamento pode ser validado de forma reprodutível?’*”

---

**SLIDE 5 — Objetivo Geral e Específicos**

O objetivo geral é **documentar e validar**, por meio de experimentos de desempenho, a arquitetura do ValorizeAI, representando um tipo de aplicação web moderna sujeita a carga variável.

Para isso,
eu mapeei a arquitetura completa,
documentei os módulos críticos,
defini SLOs claros de latência, erro e disponibilidade,
executei cenários de carga com k6,
e por fim, propus otimizações de escalabilidade e custo.

---

**SLIDE 6 — Arquitetura do Sistema**

Esta é a visão geral da arquitetura.
O tráfego entra pelo Load Balancer, que distribui requisições para seu determinado serviço.
Com a CDN que serve o conteudo estático da aplicação, como os assests do frontend, de maneira eficiente e distribuida. 
A aplicação possui três serviços principais no Cloud Run:

* a **API Laravel**, stateless, que atende requisições HTTP;
* o **servidor de WebSockets**, usando Laravel Reverb;
* e os **workers**, responsáveis por tarefas assíncronas.

O banco transacional é mantido no **Cloud SQL PostgreSQL**.
O **Redis** atua tanto como cache quanto como backplane para o Sevidor de websocket.
E o **Cloud Tasks** gerencia o pipeline assíncrono.

Um ponto importante aqui é a **elasticidade**: todos os serviços sobem e descem automaticamente conforme a carga — inclusive podendo chegar a zero — o que garante custo proporcional ao uso.

---

**SLIDE 7 — Pipeline Assíncrono**

“O pipeline assíncrono é fundamental para absorver rajadas de carga.

Em um fluxo tradicional do Laravel, nós teríamos um worker long living, rodando continuamente e esperando mensagens chegarem na fila. O problema desse modelo é que ele fica consumindo CPU mesmo quando não há trabalho, o que significa pagar por processamento ocioso e perder elasticidade.

Aqui nós seguimos uma abordagem diferente: a API não processa operações pesadas diretamente — ela apenas cria uma tarefa no Cloud Tasks.
O Cloud Tasks funciona no modelo push, enviando cada tarefa via HTTP para os workers em Cloud Run.

Como esses workers são serviços independentes e totalmente gerenciados, o Cloud Run consegue escalar horizontalmente exatamente no ritmo do backlog: quanto mais tarefas chegam, mais instâncias são criadas; quando não há nada para processar, tudo volta a zero, sem custo.

Esse comportamento combina o melhor dos dois mundos: elasticidade real e custo proporcional ao uso, garantindo que o sistema processe picos de tarefas sem travar a API principal e sem manter infraestrutura desnecessária ligada.”

---

**SLIDE 8 — WebSockets + Redis Backplane**

A comunicação em tempo real do sistema é feita pelo Reverb, o servidor de WebSockets do Laravel.

Um ponto importante é que, diferente de requisições HTTP, conexões WebSocket são persistentes: cada instância do Reverb mantém seus próprios clientes conectados em memória.
Por isso, não é possível simplesmente ‘escalar horizontalmente’ o servidor de WebSockets sem coordenação — porque as instâncias não compartilham estado.

Imagine que um cliente está conectado à instância A e outro à instância B. Se a instância A receber um evento, a instância B não fica sabendo disso sozinha. O resultado seria um comportamento inconsistente: alguns usuários receberiam eventos e outros não.

Para resolver isso, usamos o Redis como backplane Pub/Sub.
Quando qualquer instância publica um evento, o Redis distribui esse evento para todas as outras instâncias do Reverb, garantindo que todos os clientes conectados, independentemente de qual instância atenderam, recebam a mesma informação.

Com esse mecanismo, conseguimos escalar WebSockets horizontalmente de forma segura, mantendo consistência global entre as instâncias e permitindo que o serviço cresça conforme a demanda sem perder sincronização em tempo real.”

---

**SLIDE 9 — Metodologia Experimental**

A metodologia é um **estudo de caso aplicado** sobre uma aplicação real.
Eu sigo princípios de **SRE**, começando pela definição de **SLOs**:

* latência P95 menor ou igual a 300 ms;
* taxa de erro menor que 0,5%;
* e disponibilidade maior ou igual a 99,5%.

Toda a infraestrutura é provisionada com **Terraform**, os ambientes são reproduzidos com Docker e Makefile, e os testes de carga são executados com o **k6**, contra o domínio real da API.

Foram definidos três cenários:

1. leitura intensiva,
2. leitura e escrita combinadas,
3. e processamento assíncrono em larga escala.

---

**SLIDE 10 — Resultados: Cenário de Leitura**

No cenário de leitura, simulei até **1.000 usuários virtuais**, atingindo picos de quase **970 requisições por segundo**, com média de 470.
A latência P95 ficou em **158 ms**, bem abaixo do SLO, e não houve erros.

  Isso mostra que o caminho de leitura — CDN, API, Redis como cache e consultas otimizadas — é extremamente eficiente e escala bem sob carga.

---

**SLIDE 11 — Resultados: Escrita/Leitura**

“No cenário misto, cada usuário virtual alternava entre operações de leitura e escrita, simulando de forma mais fiel o comportamento real da aplicação.

Com 650 usuários virtuais, o sistema chegou a processar cerca de 540 requisições por segundo antes de começar a violar os SLOs.

Nesse ponto, a latência subiu significativamente: o P95 atingiu 658 ms e o P99 chegou a 2,67 segundos, ultrapassando o limite de 300 ms definido como SLO.

A análise detalhada das métricas mostrou que o gargalo não era o banco de dados, mas sim a camada HTTP do Cloud Run, que alcançou o limite de 10 instâncias imposto pela cota do projeto.

Esse comportamento é esperado, porque operações de escrita são mais custosas: elas exigem mais CPU, envolvem transações ACID no banco e ainda precisam invalidar cache no Redis.
Assim, o esgotamento da camada de API acontece antes da saturação do banco.”

---

**SLIDE 12 — Resultados: Processamento Assíncrono**

No pipeline assíncrono, publicamos **51.580 tarefas** no Cloud Tasks.
Em cerca de 10 minutos, todas foram processadas — cerca de 86 tarefas por segundo.

Durante esse processo, o Cloud Run escalou automaticamente o número de workers enquanto havia fila, e reduziu logo após a drenagem.
Não houve perda nem duplicação de tarefas.
Esse cenário demonstra a **elasticidade real**: o sistema usa recursos apenas quando há demanda e volta ao custo mínimo quando o trabalho termina.

---

**SLIDE 13 — Conclusões**

Os resultados mostram que a arquitetura suporta muito bem workloads intensivos em leitura.
Os limites para escrita vieram diretamente da cota de instâncias HTTP.
O pipeline assíncrono demonstrou excelente desempenho e confiabilidade.

E a principal conclusão arquitetural é que o modelo **serverless, elástico e pay-per-use** reduz custos em cargas variáveis e se adapta a picos sem intervenção manual.
Esses benefícios se aplicam não só ao ValorizeAI, mas a **qualquer aplicação web moderna com variação de demanda**.

---

**SLIDE 14 — Limitações e Trabalhos Futuros**

As principais limitações do experimento foram as cotas padrão do Cloud Run, que limitaram o número de instâncias da API, e o uso de um único nó do Cloud SQL.
Para trabalhos futuros, propomos repetir os testes com mais vCPUs, adicionar réplicas de leitura e evoluir automações e embeddings para casos como detecção de anomalias.

---

**SLIDE 15 — Referências / Encerramento**

Com isso, encerro a apresentação.
Agradeço a atenção e fico à disposição para perguntas.

---

# 🎯 **Pronto!**

Essa é a **versão final, contínua, fluida e natural**, totalmente alinhada aos seus slides reais e com o tom ideal para banca.

Se quiser, posso te entregar também:

✅ **Versão de 10 minutos**
✅ **Versão de 5 minutos** (caso peçam resumo)
✅ **Versão “anti-nervosismo”: frases mais leves e mais curtas**
✅ **Listas de perguntas que a banca provavelmente vai fazer e respostas prontas**

Quer alguma dessas?
