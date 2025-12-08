Roteiro de apresentação (15 min)
================================
Pista clara para a banca: 10–11 slides, ~1 min por slide. Tudo baseado no conteúdo real do TCC (elasticidade + observabilidade no ValorizeAI).

Cronograma sugerido
-------------------
- 1. Capa – 1:00
- 2. Contexto e lacuna – 1:20
- 3. Questão de pesquisa e objetivos – 1:20
- 4. Arquitetura geral – 2:00
- 5. Fluxos principais (sync/async/WebSocket) – 2:00
- 6. Metodologia (SLOs e cenários) – 1:30
- 7. Resultados: leitura – 1:20
- 8. Resultados: misto leitura/escrita – 1:40
- 9. Resultados: pipeline assíncrono + custo – 1:30
- 10. Conclusões – 1:10
- 11. Limitações e futuros – 0:50
- 12. Encerramento – 0:20

Slide a slide (conteúdo e falas-chave)
--------------------------------------
**1. Capa (1:00)**
- Conteúdo: título “ValorizeAI: Documentação e Validação de uma Arquitetura Serverless Elástica”, seu nome, orientador, curso, ano, logo da URI.
- Fala: “Boa tarde, eu sou o Felipe. Vou apresentar como documentei e validei uma arquitetura serverless elástica para o ValorizeAI, conectando Cloud Run, Redis, Cloud SQL, Cloud Tasks e WebSockets.”

**2. Contexto e lacuna (1:20)**
- Bullets: workloads financeiros/e-commerce variam muito; elasticidade em nuvem é resposta; sem observabilidade, a elasticidade vira caixa-preta; literatura foca peças isoladas.
- Fala: “Workloads modernos têm picos e vales. Elasticidade resolve, mas traz complexidade — microsserviços, filas, cache, WebSockets. Sem logs/métricas/traces, isso fica opaco. E quase não há validações integradas de arquiteturas híbridas como a que usamos.”

**3. Questão de pesquisa e objetivos (1:20)**
- Conteúdo: questão de pesquisa resumida; objetivo geral; 3–4 objetivos específicos.
- Fala: “Pergunta central: como essa arquitetura híbrida — Cloud Run, Redis, Cloud SQL, Cloud Tasks e WebSockets — se comporta sob carga intensa, e como validamos isso de forma reprodutível? Objetivo geral: documentar e demonstrar se ela atende aos SLOs. Específicos: mapear arquitetura end-to-end, documentar módulos críticos, planejar/executar cenários k6 e interpretar resultados propondo otimizações.”

**4. Arquitetura geral (2:00)**
- Conteúdo: Figura 1 do TCC (Load Balancer/CDN → Cloud Run API, Reverb, Workers → Redis/Cloud SQL/Cloud Storage → Cloud Tasks); legenda curta.
- Fala: “O tráfego entra pelo Load Balancer/CDN. Três serviços Cloud Run: API Laravel, servidor WebSocket Reverb e workers HTTP acionados pelo Cloud Tasks. Redis é cache e backplane Pub/Sub; Cloud SQL é o banco transacional. Tudo provisionado por Terraform.”

**5. Fluxos principais (2:00)**
- Conteúdo: Figura do fluxo síncrono (Query+Redis para leitura, Action+PostgreSQL para escrita); lembrar pipeline assíncrono e WebSocket em uma linha.
- Fala: “No síncrono, controladores chamam Queries para leitura (cache-aside no Redis) e Actions para escrita (validações + transações ACID). Operações pesadas vão para Cloud Tasks; workers drenam a fila em Cloud Run. Em paralelo, o Reverb mantém WebSockets persistentes; Redis distribui eventos entre instâncias.”

**6. Metodologia: SLOs e cenários (1:30)**
- Conteúdo: SLOs (P95 ≤ 300 ms; erro < 0,5%; disponibilidade ≥ 99,5%); ferramentas (Terraform, Docker Compose, Makefile, k6); 3 cenários (leitura; misto; pipeline assíncrono com 51,58k tasks).
- Fala: “Metodologia aplicada e reprodutível. SLOs definidos antes de testar. Infra toda em IaC + containers. Três cenários: leitura intensiva em GET /api/transactions; misto leitura/escrita; e ensaio assíncrono publicando 51,58 mil tarefas no Cloud Tasks.”

**7. Resultados: leitura (1:20)**
- Conteúdo: números-chave: 1.000 VUs; ~470 req/s média, pico ~970 req/s; P95 = 158 ms; 0% erros. Gráfico P50/P95/P99 (Figura 6).
- Fala: “Com 1.000 VUs por 17 minutos, ~470 req/s de média e pico ~970 req/s, P95 ficou em 158 ms, sem erros. As 10 instâncias de Cloud Run chegaram a ~72% de CPU, mas sem degradar. Caminho de leitura estável e abaixo do SLO.”

**8. Resultados: misto leitura/escrita (1:40)**
- Conteúdo: 650 VUs; ~226 req/s; SLO rompe ~539 VUs; P95 = 658 ms; p99 = 2,67 s; limite de 10 instâncias atingido; banco estável. Gráfico P95/P99 (Figura 7/8).
- Fala: “No cenário misto, 650 VUs sustentaram ~226 req/s. Até ~450 RPS o SLO se mantém; acima de ~539 VUs o P95 sobe para 658 ms e o p99 para 2,67 s. O limite de 10 instâncias Cloud Run é o gargalo; o Cloud SQL ficou estável, então o peso está na camada HTTP e validações de escrita.”

**9. Resultados: pipeline assíncrono + custo (1:30)**
- Conteúdo: 51,58k tasks drenadas em ≈10 min (~86 tasks/s), sem perdas/duplicações; Cloud Run escala workers e reduz ao zerar backlog. Custo: Cloud Run tem vCPU-second mais caro (1,9–2,5× C2), mas scale-to-zero elimina ociosidade e favorece cargas variáveis.
- Fala: “O pipeline assíncrono drenou 51,58 mil tarefas em cerca de 10 minutos, ~86 tasks/s, sem perdas. O Cloud Run escalou enquanto havia fila e reduziu depois, mostrando elasticidade eficiente. Em custo, mesmo com vCPU-second mais caro que C2, o pay-per-use e o scale-to-zero evitam ociosidade e tendem a ser mais econômicos para tráfego irregular.”

**10. Conclusões (1:10)**
- Bullets: leitura atende SLO com folga; escrita limitada por cota/CPU no Cloud Run, não pelo banco; pipeline assíncrono é elástico e confiável; entrega reprodutível conectando arquitetura, IaC, SLOs e testes.
- Fala: “A arquitetura atende muito bem workloads de leitura. Escrita concorrente é limitada pelo teto de instâncias e custo de CPU das rotas, não pelo banco. O pipeline assíncrono é elástico e confiável. O trabalho entrega um caso real e reprodutível que conecta design, infraestrutura e validação orientada a SLO.”

**11. Limitações e futuros (0:50)**
- Conteúdo: limitações (cotas padrão de 10 instâncias/1 vCPU; Cloud SQL único regional). Futuros (testar com 20–40 vCPU; réplicas de leitura e tuning de escrita; cenários multi-região; expandir embeddings/automação).
- Fala: “Limitações: cotas padrão e DB único. Próximos passos: repetir testes com mais vCPU, avaliar réplicas de leitura e otimizações de escrita, estudar multi-região e ampliar automações com embeddings.”

**12. Encerramento (0:20)**
- Conteúdo: frase final e “Obrigado”.
- Fala: “Mostrei que o ValorizeAI consegue ser elástico, observável e reprodutível em cima de serviços gerenciados. Obrigado, fico à disposição.”

Dicas rápidas para a banca
--------------------------
- Ensaiar 2x em voz alta com cronômetro; ajuste pausas nos slides 7–9 (resultados).
- Use os gráficos e diagramas como guia; fale olhando para a banca, não para o slide.
- Tenha respostas curtas na manga:
  - “Por que Cloud Run? Elasticidade fina + scale-to-zero + simplicidade operacional; C2/GKE exigiriam gerenciar ociosidade.”
  - “Onde está o gargalo? CPU na camada HTTP quando a escrita pesa; solução imediata: aumentar cotas ou reduzir custo/latência das rotas de escrita.”
  - “Como reproduzir? Terraform + Docker/Makefile + scripts k6 versionados; qualquer time pode rerodar os cenários.”
