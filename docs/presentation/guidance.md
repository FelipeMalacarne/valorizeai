Você pode **ler, decorar ou treinar** com ela.
O texto já está no ritmo ideal: frases curtas, fluídas, sem enrolação e com impacto técnico.



Boa tarde a todos. Meu nome é Felipe Malacarne e vou apresentar meu Trabalho de Conclusão de Curso, intitulado *ValorizeAI: Documentação e Validação de uma Arquitetura Serverless Elasticamente Gerenciada*.
Este trabalho avalia, na prática, como uma arquitetura moderna baseada em serviços gerenciados em nuvem — que escalam sob demanda e cobram apenas pelo uso — se comporta sob carga intensa em uma aplicação web real, com cargas variáveis.

**SLIDE 2 — Sumário**

A apresentação está organizada em quatro partes:
primeiro, a **introdução**, onde apresento o problema e a motivação;
depois a **metodologia**, incluindo a arquitetura do sistema e como os testes foram conduzidos;
na sequência, os **resultados** dos cenários de carga;
e por fim, as **conclusões** e os trabalhos futuros.

**SLIDE 3 — Contexto e Motivação**

O contexto deste trabalho são **aplicações web modernas**, como plataformas colaborativas, e-commerces, APIs e sistemas financeiros, que convivem com **tráfego extremamente variável**, exigem **baixa latência**, **forte consistência** e alta disponibilidade.
Para lidar com esse cenário, cresce o uso de arquiteturas **elásticas** . Elas escalam automaticamente quando há demanda, e reduzem — até mesmo a zero — quando o tráfego desaparece, evitando custo ocioso.

Por outro lado, conforme esses sistemas ficam mais distribuídos, aumenta a necessidade de **observabilidade**: logs, métricas, traces e testes reprodutíveis.
A questão central passa a ser: *essa arquitetura realmente entrega o desempenho esperado quando é pressionada por carga real?*
O ValorizeAI foi usado como caso prático justamente para investigar essa pergunta.

---

**SLIDE 4 — Problema, Lacuna e Pergunta de Pesquisa**

Quando analisamos a literatura, percebemos que grande parte dos estudos avalia **componentes isolados**: comparações entre FaaS e CaaS, análises de filas como RabbitMQ ou Kafka, estudos de ferramentas IaC ou benchmarks de API específicos.
O que praticamente não existe é uma validação **end-to-end**, integrando API, filas assíncronas, WebSockets, cache, banco transacional e todo o comportamento elástico da nuvem.

Por isso, a pergunta central deste trabalho é:
**como uma arquitetura híbrida e elástica — composta por Cloud Run, Cloud SQL, Redis, Cloud Tasks e WebSockets — se comporta sob carga intensa, e como esse comportamento pode ser validado de forma reprodutível?**

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
O tráfego entra pelo Load Balancer com CDN, que distribui requisições e conteúdo estático.
A aplicação possui três serviços principais no Cloud Run:

* a **API Laravel**, que atende requisições HTTP;
* o **servidor de WebSockets**, usando Laravel Reverb;
* e os **workers**, responsáveis por tarefas assíncronas.

O banco transacional é mantido no **Cloud SQL PostgreSQL**.
O **Redis** atua tanto como cache quanto como backplane para o Reverb.
E o **Cloud Tasks** gerencia o pipeline assíncrono.

Um ponto importante aqui é a **elasticidade**: todos os serviços sobem e descem automaticamente conforme a carga — inclusive podendo chegar a zero — o que garante custo proporcional ao uso.

---

**SLIDE 7 — Pipeline Assíncrono**

O pipeline assíncrono é fundamental para absorver rajadas.
A API não processa operações pesadas diretamente; ela cria uma tarefa no **Cloud Tasks**.
O Cloud Tasks envia essas tarefas via HTTP para os **workers**.
E como os workers são serviços Cloud Run independentes, eles escalam de acordo com o tamanho da fila: quanto maior o backlog, mais workers são criados.

Ou seja: **o sistema escala exatamente no ritmo da fila**, garantindo processamento consistente e sem travar a API principal.

---

**SLIDE 8 — WebSockets + Redis Backplane**

Já a comunicação em tempo real é feita pelo Reverb.
Como cada instância do Reverb mantém seus próprios clientes conectados, é necessário um mecanismo para sincronizar eventos entre elas.
Esse mecanismo é o **Redis**, que atua como backplane Pub/Sub.
Quando uma instância publica um evento — por exemplo, uma nova transação — o Redis replica isso para todas as outras.
Assim, a arquitetura consegue **escalar horizontalmente** sem perder consistência nos WebSockets.

---

**SLIDE 9 — Metodologia Experimental**

A metodologia é um estudo de caso aplicado.
Definimos SLOs de P95 ≤ 300 ms, taxa de erro < 0,5% e disponibilidade ≥ 99,5%.
Toda a infraestrutura foi provisionada com Terraform e Docker.
Os testes de carga foram executados com k6, contra o domínio real da API.

Testamos três cenários:

1. leitura intensiva,
2. leitura e escrita combinadas,
3. e processamento assíncrono em larga escala.

---

**SLIDE 10 — Resultados: Cenário de Leitura**

No cenário de leitura, simulamos até **1.000 usuários virtuais**, atingindo picos de quase **970 requisições por segundo**, com média de 470.
A latência P95 ficou em **158 ms**, bem abaixo do SLO, e não houve erros.

  Isso mostra que o caminho de leitura — CDN, API, Redis como cache e consultas otimizadas — é extremamente eficiente e escala bem.

---

**SLIDE 11 — Resultados: Escrita/Leitura**

No cenário misto, com 650 usuários virtuais, foi atigindo cerca de 540  requisições por segundo.
Aqui, porém, a latência sobe: P95 em **658 ms** e p99 em 2,67 s, ultrapassando o SLO.

A análise revelou que o gargalo não era o banco, mas sim a camada HTTP do Cloud Run, limitada às 10 instâncias disponíveis na cota.
Isso é esperado, pois rotas de escrita exigem mais CPU, bloqueios e invalidação de cache.

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
