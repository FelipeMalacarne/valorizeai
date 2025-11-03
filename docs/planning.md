

# 📘 Plano de TCC – ValorizeAI em Arquitetura Kubernetes (GKE Autopilot) com Baixo Vendor Lock-in

## 🎯 Tema e Objetivos

**Tema:** Documentar e validar a escalabilidade e a alta disponibilidade do aplicativo financeiro **ValorizeAI** executando integralmente em GKE Autopilot, complementado apenas por serviços mínimos como Cloud Tasks, priorizando baixo vendor lock-in.

**Objetivos específicos**

1. Apresentar a arquitetura completa do ValorizeAI (API, WebSockets, processamento assíncrono, plano de dados) destacando como os componentes em Kubernetes se relacionam.
2. Definir SLOs de escalabilidade e disponibilidade e demonstrar, por meio de experimentos, que o ValorizeAI consegue atingi-los na plataforma escolhida.
3. Fornecer infraestrutura como código (Terraform + GitOps) que permita reproduzir o ambiente com o mínimo de dependências proprietárias.

**Perguntas de pesquisa**

* Quais limites de carga o ValorizeAI suporta antes de degradar os SLOs definidos?
* Como o cluster GKE Autopilot se comporta diante de falhas planejadas (ex.: perda de um pod ou zona) mantendo o aplicativo disponível?
* Qual o custo aproximado para manter o ambiente escalável com foco em componentes portáveis?

> **Nota metodológica:** Não há pretensão de provar superioridade em relação a serviços 100% gerenciados; o objetivo é demonstrar que o desenho atual do ValorizeAI é válido, escalável e disponível dentro dos SLOs definidos.

---

## ✅ Premissas e Propostas

* **Premissas:** tráfego HTTP variável típico de um aplicativo financeiro, necessidade de consistência forte para operações críticas, uso intenso de tempo real (WebSockets) e busca semântica para recomendações.
* **Proposta de valor:** executar tanto o plano de execução quanto o de dados dentro do GKE Autopilot (com namespaces isolados), mantendo flexibilidade para requisitos específicos do ValorizeAI (extensões Postgres, Redis Cluster, configurações personalizadas no Elasticsearch) e reduzindo dependência de serviços proprietários.
* **Premissas de SLO:** latência P95 < 250 ms, indisponibilidade < 0.5% e capacidade de processar até 5k RPS com degradação controlada.
* **Hipótese operacional:** se o desenho aderir às premissas (multi-zona, HPA, replicação), os SLOs do ValorizeAI serão atendidos mesmo sem serviços gerenciados proprietários.

---

## ☁️ Arquitetura Proposta

### 🔹 Edge / Rede

* **Cloud Load Balancing (HTTP(S)) + Cloud CDN**
* **Cloud Armor** para WAF e rate limiting
* **Identity-Aware Proxy** para painéis internos e acesso ao Kibana/pgAdmin

### 🔹 Plano de Execução (GKE Autopilot)

| Serviço                         | Plataforma / Recurso           | Observações                                                                 |
| ------------------------------- | ------------------------------ | --------------------------------------------------------------------------- |
| API Laravel                     | Deployment + HPA               | Pods stateless, autoscaling 1↔n, expostos via Ingress + Cloud Load Balancer |
| Laravel Reverb / WebSockets     | Deployment + HPA               | Horizontal scaling com Redis Cluster; afinidade por zona opcional           |
| Workers HTTP (push tasks)       | Deployment exposto via Service | Recebe requisições do Cloud Tasks; middleware de idempotência e DLQ local   |
| Cronos críticos                 | Kubernetes CronJob             | Executam containers imutáveis; registram logs via FluentBit → Cloud Logging |
| Workers batelados               | Kubernetes Job/Argo Workflow   | Disparados manualmente ou por CronJob; usam filas internas em Redis/DB      |

### 🔹 Plano de Dados em GKE Autopilot

| Componente      | implementação GKE Autopilot | Especificações principais                                                                                         |
| --------------- | --------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| PostgreSQL HA   | StatefulSet Patroni + PgBouncer | 3 pods data multi-zona + 1 pod witness; discos `pd-ssd` regionais; backups via pgBackRest para Cloud Storage         |
| Réplicas leitura| Serviços Read-Only          | Expostas por `Service` dedicado; sincronismo assíncrono com atraso monitorado                                       |
| Redis Cluster   | StatefulSet Redis 7         | Cluster mode enabled (3 masters + 3 replicas); failover automático; backups com `redis-cli --rdb`                  |
| Elasticsearch   | StatefulSet (3 data + 2 master elegíveis + 1 ingest) | PVC `pd-balanced`, ILM + snapshots diários; upgrades orquestrados via `maxUnavailable=1`                           |
| Operação        | Config Sync + Backup for GKE | ConfigMaps para parâmetros sensíveis, Secret Manager → CSI; monitoramento com GKE Managed Prometheus + Grafana      |

Benefícios principais do Autopilot: nós gerenciados, segurança reforçada (sandbox gVisor), billing por pod e auto-provisionamento de nós multi-zona.

### 🔹 Mensageria / Filas

* **Cloud Tasks** para tarefas HTTP e controle de retries (push endpoint exposto via Ingress do cluster)
* **Redis Streams / filas internas** para jobs batelados e padrões outbox
* Eventuais automações são executadas por CronJobs ou fluxos GitOps, evitando dependência de Eventarc/Pub/Sub

### 🔹 Observabilidade e Resiliência

* **Cloud Monitoring + Managed Prometheus + Grafana** (dashboards específicos para workloads GKE)
* **Logs estruturados** em Cloud Logging + roteamento para BigQuery/Elastic
* **Tracing** com Cloud Trace e OpenTelemetry exporter
* SLOs de referência: latência P95 < 250 ms, erro % < 0.5%, disponibilidade >= 99.5%

### 🔹 Segurança

* **VPC dedicada + sub-redes privadas**; GKE Autopilot Private Cluster
* **Secret Manager + CSI Driver**, chaves KMS para discos
* **Policies**: IAM mínimo necessário, Binary Authorization para imagens do cluster stateful

### 🔹 Infraestrutura (IaC)

```
/envs
  dev/
  staging/
  prod/
/modules
  gke_autopilot_cluster/
  gke_workloads_app/
  postgres_patroni_statefulset/
  redis_cluster_statefulset/
  elasticsearch_statefulset/
  vpc_networking/
  observability_stack/
  secret_manager/
  cloud_tasks_queue/
```

* Pipelines: Cloud Build → testes Terraform (`terraform validate` + `tflint`), build/push de imagens, `kubectl apply`/GitOps (Config Sync / ArgoCD) para workloads GKE, verificação de saúde automatizada.

---

## 🧠 Hipóteses e Plano de Testes

### Hipóteses

1. **Escalabilidade Horizontal**
   * **H₀₁:** Ao elevar a carga do ValorizeAI até 5k RPS, a latência P95 excede 250 ms ou a taxa de erros ultrapassa 0,5%.
   * **H₁₁:** Mesmo em 5k RPS, o sistema mantém os SLOs de latência e erro definidos.
2. **Resiliência a Falhas**
   * **H₀₂:** Falhas controladas (remoção de pod mestre do Postgres, perda de zona, indisponibilidade temporária do Redis) causam indisponibilidade superior a 60 segundos ou perda de dados.
   * **H₁₂:** Os mecanismos de failover restauram o serviço em < 60 s sem perda percebida pelos usuários.
3. **Processamento Assíncrono**
   * **H₀₃:** O pipeline Cloud Tasks → Workers em GKE não consegue drenar um backlog 10× superior ao normal em tempo hábil (< 5 minutos) ou gera efeitos colaterais (duplicidade, jobs órfãos).
   * **H₁₃:** O pipeline processa o backlog reforçado dentro do tempo alvo mantendo idempotência e consistência.
4. **Busca Semântica e Experiência**
   * **H₀₄:** Durante reindexações e rolling upgrades do cluster Elasticsearch, há degradação perceptível (latência P95 > 500 ms ou precisão@10 abaixo do baseline).
   * **H₁₄:** O cluster mantém relevância e latência estáveis mesmo durante operações de manutenção.
5. **Sustentabilidade Operacional**
   * **H₀₅:** Para cumprir os SLOs, o custo mensal excede o orçamento definido ou as rotinas IaC/GitOps não garantem reprodutibilidade do ambiente.
   * **H₁₅:** O ambiente opera dentro do orçamento previsto e pode ser reprovisionado integralmente via IaC/GitOps sem intervenção manual crítica.

Cada teste da matriz abaixo aponta explicitamente qual hipótese está sendo verificada. Evidências contrárias mantêm a hipótese nula; evidências favoráveis permitem rejeitá-la e fortalecer a narrativa de escalabilidade e resiliência.

### Matriz de testes

| # | Hipótese                  | Objetivo                             | Cenários / Premissas                                                                 | Métricas principais                            | Ferramentas                           | Critério de sucesso                                           |
| - | ------------------------- | ------------------------------------ | ------------------------------------------------------------------------------------ | ---------------------------------------------- | ------------------------------------- | ------------------------------------------------------------- |
| 1 | H₀₁ vs H₁₁               | Escalabilidade horizontal            | Burst 0 → 5k RPS; Deployments da API no GKE até limite; HPA dos StatefulSets acionado | Latência P95, throughput, CPU/mem dos pods     | k6/Locust, Cloud Monitoring           | Latência P95 < 250 ms, erro % < 0.5%, throughput linear até 5k RPS |
| 2 | H₀₂ vs H₁₂               | Resiliência a falhas                 | Derrubar pod PostgreSQL mestre, simular perda de zona, injetar latência em Redis    | MTTR, erro %, atraso de replicação, perda de dados | Chaos Mesh, Fault Injection policy, pg_stat_replication | MTTR < 60 s, erro % < 1%, sem perda de dados perceptível      |
| 3 | H₀₃ vs H₁₃               | Processamento assíncrono             | Criar backlog 10× maior no Cloud Tasks; pausar e retomar Deployment de workers no GKE | Tempo para drenar fila, itens duplicados, jobs com falha | Cloud Tasks metrics, Cloud Logging, dashboards customizados | Backlog drenado < 5 min, zero duplicidade não tratada, erro < 0.5% |
| 4 | H₀₄ vs H₁₄               | Busca semântica resiliente           | Rolling upgrade Elasticsearch + reindex + consulta golden queries                   | P95 busca, precisão@10, tempo de recovery      | Rally, Elastic Synthetics             | Zero downtime percebido, precisão >= baseline                 |
| 5 | H₀₅ vs H₁₅               | Sustentabilidade operacional         | Simular um ciclo completo de provisioning via Terraform + GitOps e monitorar custos em cargas 10/50/100% | Tempo de reprovisionamento, custo por 1k requisições, horas de operação | Terraform Cloud/CLI, Config Sync, Billing Export → BigQuery | Reprovisionamento < 2h, custo dentro do orçamento, zero passos manuais críticos |

Todos os testes registram evidências (scripts, dashboards, logs) anexados como apêndice do TCC.

---

## ✍️ Plano Detalhado de Escrita do TCC

1. **Introdução**  
   * Contexto do setor financeiro, problemas de escalabilidade e compliance.  
   * Motivação para unir serverless e clusters stateful próprios.  
   * Objetivos, perguntas de pesquisa e delimitações.
2. **Contexto e Trabalhos Relacionados**  
   * Panorama de serviços gerenciados e clusters Autopilot, indicando vantagens e limitações de cada abordagem.  
   * Referenciais sobre arquiteturas híbridas serverless + Kubernetes e casos de uso semelhantes.
3. **Fundamentação Teórica**  
   * Conceitos de serverless, GKE Autopilot, consistência distribuída, padrões de resiliência.  
   * Padrões arquiteturais (CQRS, outbox, circuit breakers).
4. **Produto ValorizeAI e Requisitos**  
   * Descrição do aplicativo, personas, fluxos críticos e requisitos não funcionais.  
   * SLOs adotados, métricas de negócio e critérios de sucesso dos experimentos.
5. **Arquitetura Proposta**  
   * Diagramas de contexto e implantação.  
   * Justificativas das escolhas (cluster único com namespaces isolados, operadores stateful, uso pontual de Cloud Tasks).  
   * Matriz de riscos e mitigações.
6. **Metodologia Experimental**  
   * Ambiente (quotas, regiões, tamanhos de pods).  
   * Ferramentas, scripts e métricas coletadas.  
   * Procedimento para cada teste associado às hipóteses.
7. **Implementação**  
   * Organização dos módulos Terraform, pipelines, manifestos Kubernetes.  
   * Adequações na aplicação Laravel (configurações, instrumentação, feature flags).  
   * Detalhes das integrações (Reverb, Pub/Sub, Redis cluster, Cloud Tasks).
8. **Experimentos e Resultados**  
   * Apresentação visual (gráficos, tabelas) para cada teste.  
   * Comparação entre resultados observados e SLOs/metas definidos.  
   * Evidências que aceitam ou rejeitam cada hipótese.
9. **Discussão e Trabalhos Futuros**  
   * Impacto operacional, requisitos de equipe, riscos remanescentes.  
   * Próximos passos técnicos (ex.: Spanner, AlloyDB, autoscaling baseado em AI).  
10. **Conclusão**  
    * Retoma objetivos e responde perguntas de pesquisa.  
    * Recomendações práticas para equipes que desejam replicar o blueprint.

Apêndices sugeridos: manifestos Terraform, scripts k6, dashboards, checklist de segurança.

---

## 🗓️ Cronograma de 30 Dias (Implementação + Escrita)

| Semana | Foco Principal                          | Atividades chave                                                                 |
| ------ | --------------------------------------- | --------------------------------------------------------------------------------- |
| 1      | Planejamento & Infraestrutura           | Refinar SLOs, ajustar módulos Terraform, provisionar VPC + GKE Autopilot e Cloud Tasks |
| 2      | Aplicação & Observabilidade             | Conectar Laravel a Postgres/Redis/ES no cluster, configurar métricas, GitOps      |
| 3      | Testes e Evidências                     | Executar matriz de testes 1–4, coletar dashboards, ajustar automações             |
| 4      | Custo, Análise e Escrita                | Rodar teste 5, consolidar dados, redigir capítulos 5–9, revisar conclusões        |

Cada semana reserva blocos específicos para escrita (mín. 2 sessões) e revisão de orientador.

---

## 💡 Próximos Passos Imediatos

1. Finalizar diagramas e checklist de requisitos para o cluster Autopilot (quotas, regiões, tamanhos de disco).
2. Converter módulos Terraform existentes para o layout acima e preparar repositório GitOps dos manifests stateful.
3. Esboçar scripts de teste (k6, PgBench, Chaos Mesh) e validar em ambiente dev.
4. Criar template do TCC (Markdown/LaTeX) com a estrutura detalhada para iniciar a escrita incremental.

---

Se quiser, posso ajudar a montar os módulos Terraform, scripts de teste ou o template de escrita. Só avisar! 😊
