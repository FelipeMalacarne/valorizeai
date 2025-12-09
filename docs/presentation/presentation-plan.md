Beleza, vamos focar em te **preparar pra banca**, não no PowerPoint em si 😄

Vou te passar:

* **Estrutura sugerida de slides** (você monta no modelo da instituição)
* **O que escrever em cada slide (bullets)**
* **Um roteiro de fala em voz alta pra cada slide**
* Com ideia de tempo pra fechar em ~15 minutos

Tudo baseado no teu artigo do ValorizeAI .

---

## Visão geral da apresentação (15 min / 10–11 slides)

Sugestão de estrutura (que encaixa no modelo: Introdução / Metodologia / Resultados / Referências):

1. Título
2. Sumário
3. Contexto & Motivação
4. Problema, lacuna e pergunta de pesquisa
5. Objetivo geral e específicos
6. Arquitetura do ValorizeAI
7. Metodologia experimental (SLOs, k6, IaC)
8. Resultados – cenário de leitura
9. Resultados – cenário misto + assíncrono
10. Conclusões, limitações e trabalhos futuros
11. Agradecimento / Perguntas (opcional, se couber)

---

## SLIDE 1 – Título (≈ 30–40 s)

**No slide (bem direto):**

> ValorizeAI: Documentação e Validação de uma Arquitetura Serverless Elasticamente Gerenciada
> Autor: Felipe Tomkiel Malacarne
> Orientador: Prof. Me. Marcos André Lucas
> Curso de Ciência da Computação – URI Erechim – 2025

**Fala sugerida:**

> “Boa tarde a todos. Meu nome é Felipe Malacarne e vou apresentar meu Trabalho de Conclusão de Curso, intitulado *‘ValorizeAI: Documentação e Validação de uma Arquitetura Serverless Elasticamente Gerenciada’*.
> Esse trabalho foi desenvolvido sob orientação do professor Marcos André Lucas, no curso de Ciência da Computação da URI Erechim.”

Se quiser, emenda:

> “A ideia central é avaliar, na prática, como uma arquitetura moderna baseada em serviços gerenciados em nuvem se comporta sob carga intensa em um cenário financeiro real.”

---

## SLIDE 2 – Sumário (≈ 40–50 s)

**No slide:**

* Introdução
* Metodologia
* Resultados
* Conclusões e Trabalhos Futuros

**Fala sugerida:**

> “A apresentação está organizada em quatro partes.
> Primeiro, faço uma breve **introdução** ao problema e à motivação do trabalho.
> Depois, explico a **metodologia**, incluindo a arquitetura do sistema e como os testes foram conduzidos.
> Em seguida, apresento os **principais resultados** obtidos.
> E, por fim, trago as **conclusões**, limitações e propostas de trabalhos futuros.”

---

## SLIDE 3 – Contexto & Motivação (≈ 1,5 min) – *Introdução*

**No slide (poucos bullets):**

* Plataformas financeiras: tráfego variável, forte consistência, baixa latência
* Elasticidade em nuvem (Cloud Run, serviços gerenciados)
* Complexidade → necessidade de observabilidade e validação integrada 

**Fala sugerida:**

> “O contexto deste trabalho são **plataformas financeiras modernas**, que lidam com picos de transações, muita leitura e escrita, e ao mesmo tempo precisam manter **consistência forte, baixa latência e alta disponibilidade**.
> A resposta comum a isso é usar a **elasticidade da nuvem** – serviços como Cloud Run, Cloud SQL, Redis gerenciado, filas, etc., que escalam automaticamente conforme a carga.
> O problema é que, conforme a arquitetura vai ficando mais distribuída e elástica, cresce também a **complexidade de entender e observar o sistema**. Logs, métricas e traces passam a ser fundamentais, e surge a necessidade de **validar na prática** se aquela arquitetura realmente aguenta a carga que se espera dela.”

Se quiser reforçar:

> “O ValorizeAI entra como um caso real para estudar essa relação entre elasticidade e observabilidade em um cenário financeiro.”

---

## SLIDE 4 – Problema, Lacuna e Pergunta de Pesquisa (≈ 1,5 min) – *Introdução*

**No slide:**

* Literatura trata **componentes isolados** (FaaS vs CaaS, filas, IaC, etc.)
* Poucos estudos **end-to-end** de arquiteturas híbridas (CaaS + filas + WebSockets) 
* **Pergunta:** como essa arquitetura se comporta sob carga intensa?

**Fala sugerida:**

> “Quando a gente olha para a literatura, existem vários trabalhos bons, mas quase sempre olhando **um pedaço** do problema:
> – comparação entre FaaS e CaaS;
> – estudos de diferentes filas, como RabbitMQ, Kafka, Pulsar;
> – comparações entre ferramentas de Infraestrutura como Código;
> – ou estudos de desempenho focados em uma única API.
>
> O que praticamente **não aparece** são validações **integradas**, de ponta a ponta, em um sistema real que combine tudo isso: containers gerenciados, filas assíncronas, WebSockets, cache, banco relacional e SRE.
>
> Então a **pergunta central** do trabalho é:
> *‘Como uma arquitetura híbrida e elástica, composta por Cloud Run, Redis, Cloud SQL, Cloud Tasks e WebSockets dedicados, se comporta sob condições intensas de carga, e como esse comportamento pode ser validado de forma reprodutível?’*”

---

## SLIDE 5 – Objetivo Geral e Específicos (≈ 1 min) – *Introdução*

**No slide:**

**Objetivo geral**

* Documentar e validar, por meio de experimentos de desempenho, a arquitetura do ValorizeAI.

**Objetivos específicos** (em bullets):

* Mapear a arquitetura end-to-end
* Documentar módulos críticos (ingestão, automações, notificações, dashboards)
* Planejar e executar testes de carga com k6
* Validar SLOs de latência, erro e disponibilidade
* Propor otimizações de escalabilidade e custo 

**Fala sugerida:**

> “O **objetivo geral** é demonstrar, de forma prática, que a arquitetura do ValorizeAI consegue sustentar metas de desempenho e confiabilidade típicas de um produto financeiro real.
>
> Para isso, eu:
> – mapeei a arquitetura completa;
> – documentei os módulos mais críticos para o fluxo transacional;
> – defini SLOs claros de latência, erro e disponibilidade;
> – executei cenários de carga reprodutíveis com k6;
> – e, a partir dos resultados, propus ajustes e otimizações.”

---

## SLIDE 6 – Arquitetura do ValorizeAI (≈ 2 min) – *Conteúdo / Metodologia*

Aqui é um ótimo lugar pra colocar a **Figura 1** (arquitetura) no slide.

**No slide (texto curto ao lado ou abaixo da figura):**

* Cloud Load Balancer + Cloud CDN
* 3 serviços Cloud Run: API, Reverb (WebSocket), Workers
* Cloud SQL (PostgreSQL), Redis (Memorystore), Cloud Tasks 

**Fala sugerida (explicando a figura):**

> “Aqui está a **visão geral da arquitetura** utilizada nos experimentos.
> O tráfego chega pelo **Load Balancer** com **CDN**, que cuida da distribuição e de conteúdo estático.
> A aplicação em si é dividida em três serviços no **Cloud Run**:
>
> * A **API Laravel**, que atende as requisições HTTP;
> * O **servidor de WebSockets** com Laravel Reverb, responsável pela comunicação em tempo real;
> * E os **workers**, que processam tarefas assíncronas disparadas pelo Cloud Tasks.
>
> O **Cloud SQL** mantém o banco transacional em PostgreSQL;
> o **Redis** funciona tanto como **cache** de leitura quanto como **backplane Pub/Sub** para o Reverb;
> e o **Cloud Tasks** gerencia o pipeline assíncrono, permitindo que o sistema absorva rajadas de tarefas sem travar a API.”

Se quiser, arremata:

> “Tudo isso é provisionado como código, usando Terraform, o que permite recriar o ambiente de forma determinística.”

---

## SLIDE 7 – Metodologia Experimental (≈ 2 min) – *Metodologia*

**No slide:**

* Metodologia aplicada, estudo de caso real
* SLOs:

  * P95 ≤ 300 ms
  * Erro < 0,5%
  * Disponibilidade ≥ 99,5%
* Ferramentas: Terraform, Docker, Makefile, k6, Cloud Monitoring
* 3 cenários de teste:

  * Leitura intensiva
  * Leitura/Escrita
  * Pipeline assíncrono (Cloud Tasks) 

**Fala sugerida:**

> “A metodologia é um **estudo de caso aplicado** sobre uma aplicação real.
> Eu sigo princípios de **SRE**, começando pela definição de **SLOs**:
>
> * latência P95 menor ou igual a 300 ms;
> * taxa de erro menor que 0,5%;
> * e disponibilidade maior ou igual a 99,5%.
>
> Toda a infraestrutura é provisionada com **Terraform**, os ambientes são reproduzidos com Docker e Makefile, e os testes de carga são executados com o **k6**, contra o domínio real da API.
>
> Foram definidos três cenários:
>
> * um cenário de **leitura intensiva**, focado em GET /api/transactions;
> * um cenário **misto**, combinando leitura e escrita de transações;
> * e um teste do **pipeline assíncrono**, publicando mais de 50 mil tarefas no Cloud Tasks e monitorando a drenagem.”

---

## SLIDE 8 – Resultados: Cenário de Leitura (≈ 2 min) – *Resultados*

Se tiver como, coloca aqui a figura das latências P50/P95/P99 do cenário de leitura (Figura 6).

**No slide (texto curto + gráfico):**

* 1.000 usuários virtuais (VUs)
* ~470 req/s (pico ~970 req/s)
* P95 = 158 ms (bem abaixo do SLO)
* 0% de erros 

**Fala sugerida:**

> “No cenário de **leitura intensiva**, eu simulei até **1.000 usuários virtuais** acessando o endpoint de listagem de transações, durante cerca de 17 minutos.
> O sistema sustentou em média **470 requisições por segundo**, chegando a picos próximos de **970 req/s**.
>
> A latência **P95 ficou em 158 ms**, ou seja, bem abaixo do limite de 300 ms definido no SLO, e **nenhuma requisição falhou**.
>
> Esse resultado mostra que o caminho de leitura — combinando CDN, API em Cloud Run, **Redis como cache** e consultas eficientes no PostgreSQL — é bastante robusto e escala bem sob carga.”

---

## SLIDE 9 – Resultados: Cenário Misto + Assíncrono (≈ 3 min) – *Resultados*

Aqui você pode dividir em dois blocos no mesmo slide (ou dois slides, se estiver confortável).

**No slide (parte 1 – cenário misto):**

* 650 VUs (65% leitura, 35% escrita)
* ~226 req/s
* P95 = 658 ms; p99 = 2,67 s
* Saturação em 10 instâncias de Cloud Run (gargalo na camada HTTP) 

**Fala sugerida (misto):**

> “No **cenário misto**, cada usuário virtual alternava entre leituras e escritas, aproximando-se do padrão observado no uso real.
> Com **650 VUs**, o sistema manteve cerca de **226 requisições por segundo**.
>
> Aqui, o comportamento muda: o P95 da latência sobe para **658 ms** e o p99 chega a **2,67 segundos**, violando o SLO de 300 ms.
> A análise das métricas mostra que o gargalo não foi o banco de dados, e sim a **camada HTTP no Cloud Run**, que chegou ao limite de **10 instâncias** configuradas.
>
> Isso faz sentido, porque o caminho de escrita é mais pesado: envolve validações, transações ACID e invalidação de cache.”

**No slide (parte 2 – pipeline assíncrono):**

* 51.580 tarefas no Cloud Tasks
* ≈ 10 minutos → ≈ 86 tarefas/s
* Escalonamento automático de workers
* Sem perdas ou duplicações 

**Fala sugerida (assíncrono):**

> “Já no **pipeline assíncrono**, foram publicadas **51.580 tarefas** em lote.
> Em aproximadamente **10 minutos**, todas foram processadas, o que dá em torno de **86 tarefas por segundo em média**.
>
> O Cloud Run escalou automaticamente o número de **workers** enquanto havia backlog, reduzindo depois que a fila esvaziou.
> Não houve **perda** nem **duplicação** de tarefas, o que mostra um comportamento elástico e confiável para workloads assíncronos.”

---

## SLIDE 10 – Conclusões, Limitações e Trabalhos Futuros (≈ 2–3 min) – *Resultados / Conclusões*

Você pode usar três blocos: **Conclusões**, **Limitações**, **Trabalhos futuros**.

**No slide – Conclusões:**

* Arquitetura atende bem workloads intensivos em leitura
* Escrita concorrente limitada pela cota de instâncias HTTP
* Pipeline assíncrono (Cloud Tasks + workers) é elástico e confiável 

**Fala sugerida (conclusões):**

> “Como conclusão, o trabalho mostrou que:
>
> * a arquitetura do ValorizeAI **suporta muito bem workloads de leitura**, mesmo em cenários com mil usuários simultâneos;
> * o ponto de atenção está nos **caminhos de escrita**, onde o limite de instâncias e o custo computacional por requisição acabam degradando a latência;
> * e o pipeline assíncrono, baseado em Cloud Tasks e workers em Cloud Run, se mostrou **bastante eficiente** para processar grandes volumes sem intervenção manual.”

**No slide – Limitações:**

* Cota de 10 instâncias (1 vCPU) no Cloud Run
* Banco em uma única instância regional 

**Fala sugerida (limitações):**

> “Duas limitações principais influenciam os resultados:
>
> * a infraestrutura foi testada com as **cotas padrão** de um projeto recém-provisionado, com apenas 10 instâncias de 1 vCPU para a API;
> * o banco permaneceu em uma **única instância** regional do Cloud SQL, o que, em cenários ainda maiores, pode se tornar um gargalo.”

**No slide – Trabalhos futuros:**

* Repetir testes com mais vCPUs/instâncias
* Réplicas de leitura e particionamento
* Evolução de embeddings e automações (detecção de anomalias, recomendações) 

**Fala sugerida (futuro):**

> “Como próximos passos, é interessante:
>
> * repetir os testes com **limites maiores de instâncias e CPU**, para ver onde surgem novos gargalos;
> * estudar o uso de **réplicas de leitura** e talvez **particionamento de dados** para aliviar as rotas mais críticas;
> * e evoluir o uso de **embeddings** e automações do ValorizeAI para cenários como detecção de anomalias e recomendações financeiras.”

---

## SLIDE 11 – Encerramento / Perguntas (≈ 30–40 s)

**No slide (simples):**

> Obrigado!
> Perguntas?

**Fala sugerida:**

> “Com isso, encerro a apresentação do meu trabalho.
> Agradeço a atenção de vocês e fico à disposição para dúvidas e comentários.”

---

## Dicas rápidas de entrega (pra treinar):

1. **Não leia os slides.** Use os bullets como gatilho e conte com suas palavras.
2. **Treina com cronômetro**:

   * 2–3 min para Introdução (slides 3,4,5)
   * 4–5 min para Arquitetura + Metodologia (6,7)
   * 5–6 min para Resultados (8,9)
   * 2–3 min para Conclusões (10,11)
3. Deixa sempre **1 exemplo concreto** na ponta da língua, tipo:

   > “Se amanhã dobrar o número de usuários consultando extratos, o cenário de leitura mostra que a arquitetura aguenta bem esse tipo de carga.”

---

Se você quiser, no próximo passo eu posso:

* **Transformar esse roteiro em “falas em primeira pessoa” ainda mais fluídas**, como se fosse um texto contínuo pra decorar; ou
* Montar uma **versão ultra-resumida** só com frases-chave pra você usar no dia da apresentação.
