# Diretrizes do TCC ValorizeAI

Este guia traduz a estrutura clássica da SBC para a realidade do projeto ValorizeAI. Use-o como checklist para manter coerência entre o texto, o código e as evidências já reunidas no repositório (especialmente `docs/planning.md`, `docs/system-design.md`, `docs/test-results.md`, `docs/features/*` e `tests/k6/scenarios/*`). Lembre-se de que o artigo completo deve ter **no máximo 25 páginas**, conforme exigência do evento.

---

## Introdução proposta

> **Texto base:**  
> O gerenciamento financeiro eficaz é decisivo em um cenário de economia volátil, múltiplas contas digitais e grandes volumes de transações. Processos manuais de conciliação, planejamento orçamentário e acompanhamento de investimentos não acompanham o ritmo exigido por usuários que esperam respostas em tempo real e interfaces unificadas. O ValorizeAI surge justamente para orquestrar essas frentes: trata-se de uma aplicação web que centraliza contas, transações, budgets, cartões e investimentos em uma única experiência, apoiada por importação automatizada de extratos e notificações em tempo real.
>
> A relevância deste trabalho está em mostrar como uma arquitetura pensada para suportar esse domínio consegue equilibrar elasticidade, observabilidade e custo. O texto navega pelos principais blocos arquiteturais adotados — balanceamento global com CDN, containers que escalam horizontalmente sob demanda, um servidor de WebSockets dedicado, pipelines assíncronos baseados em filas, cache em Redis e buckets para armazenamento de artefatos — e demonstra, por meio de testes de carga realizados com k6, até onde essa combinação se mantém dentro dos SLOs definidos em `docs/planning.md`. O foco recai menos no provedor de nuvem específico e mais na forma como esses componentes se encaixam para entregar confiabilidade a um produto financeiro completo.

## Justificativa

> **Texto base:**  
> Plataformas financeiras que oferecem conciliação bancária, planejamento de budgets e acompanhamento de investimentos concentram fluxos críticos: eles exigem consistência forte, rastreabilidade para auditoria e resposta instantânea em picos imprevisíveis (folha de pagamento, virada de ciclo de cartão, liquidações de bolsa). Apesar de existirem guias fragmentados sobre cada tecnologia, há pouco material que conecte os blocos arquiteturais — balanceadores com CDN, camadas de cache e filas assíncronas, servidores de WebSockets e pipelines de dados — aos resultados práticos de testes de performance. Ao construir o ValorizeAI end-to-end e registrar os experimentos de leitura, leitura e escrita (`docs/test-results.md`) e o teste de processamento assíncrono documentado em `docs/tests/3-test-queue/README.md`, este TCC evidencia como essas decisões se traduzem em métricas: o teste de leitura mantém a latência P95 em 158 ms, o de leitura e escrita revela gargalos ao combinar escrita intensa/streaming, e o teste de processamento assíncrono mostra que 51,58 mil tarefas foram drenadas em ~10 min. Documentar esse caminho, apoiado por infraestrutura como código e monitoramento de custo, fornece uma referência concreta para equipes que precisam justificar arquiteturas orientadas a eventos com elasticidade horizontal automática.

## Objetivos

### Objetivo geral

Demonstrar, por meio de documentação técnica e experimentos de desempenho, que a arquitetura do ValorizeAI — composta por balanceador com CDN, containers escalados horizontalmente, processamento assíncrono em filas, servidor de WebSockets, buckets para artefatos e cache em Redis — sustenta os SLOs definidos para um sistema financeiro completo, mantendo todo o ciclo (modelagem, desenvolvimento, infraestrutura, observabilidade e testes) versionado no repositório.

### Objetivos específicos

1. **Mapear a arquitetura end-to-end**, destacando o papel do balanceador/CDN, das instâncias de containers, do servidor de WebSockets, das filas assíncronas, dos buckets de armazenamento e do Redis para garantir consistência e baixa latência (`docs/planning.md`, `docs/system-design.md`).
2. **Documentar o desenvolvimento do backend Laravel, do frontend React e dos fluxos assíncronos**, com foco nos módulos de conciliação, budgets, cartões e investimentos, aproveitando os registros em `docs/features/*`, `app/` e `resources/`.
3. **Planejar e executar os testes de carga** (k6, cenários de leitura e de leitura/escrita) e o teste de processamento assíncrono (`docs/tests/3-test-queue/README.md`) para validar horizontalmente a arquitetura frente aos SLOs e identificar gargalos usando os scripts em `tests/k6/scenarios/*`.
4. **Interpretar os resultados e propor otimizações**, relacionando desempenho, elasticidade e custo (ex.: ajustes de limites de instância, estratégias de cache e particionamento de consultas) e apontando como essas evidências fundamentam decisões para workloads financeiros.

---

## Guia por seção da estrutura SBC

### Resumo (Abstract)
- **Foco narrativo:** sintetizar o problema (complexidade de operar sistemas financeiros), a abordagem arquitetural (balanceador + CDN, containers com escalabilidade horizontal, WebSockets dedicados, filas assíncronas, cache Redis e armazenamento em buckets) e os principais achados dos testes de carga (teste de leitura cumpre SLO, teste de leitura e escrita revela gargalos, teste de processamento assíncrono confirma drenagem dentro da meta de 10 min).
- **Dados obrigatórios:** objetivos, metodologia (infra como código + k6), principais resultados (p95=158 ms para o teste de leitura, p95=4,03 s para o teste de leitura e escrita, 51,58 mil tarefas drenadas em ~10 min no teste de processamento assíncrono) e conclusões sobre escalabilidade.
- **Fontes no repositório:** `docs/planning.md` (SLOs e premissas), `docs/test-results.md` (métricas k6), `docs/tests/3-test-queue/README.md` (fila/Cloud Tasks).
- **Sugestões de referências:** guias da própria SBC sobre resumos estruturados e normas ABNT 6028 para reforçar a padronização.

### 1. Introdução
- **Conteúdo:** reutilize o texto base acima, conectando com os desafios macros (crescimento das fintechs, pressão por confiabilidade) e citando as perguntas de pesquisa definidas em `docs/planning.md`.
- **Checklist:**
  - Contextualização do domínio financeiro brasileiro.
  - Breve descrição do ValorizeAI e da pilha (Laravel 11, React, balanceador/CDN, containers autoscaláveis, WebSockets, filas, Redis e buckets).
  - Objetivos geral e específicos (copiar/ajustar a seção anterior).
  - Estrutura do artigo (antecipe onde entram arquitetura, implementação, testes e discussões).

### 2. Trabalhos Relacionados / Revisão Bibliográfica
- **Foco:** situar o ValorizeAI frente a pesquisas sobre serverless, fintechs e observabilidade em nuvens gerenciadas.
- **Diretrizes:**
  - Compare abordagens baseadas em Kubernetes/self-hosted com serviços totalmente gerenciados.
  - Levante publicações sobre uso de plataformas de containers gerenciadas e estratégias de escalabilidade horizontal em cenários financeiros, priorizando revistas e eventos da SBC, IEEE ou ACM.
  - Traga relatórios de mercado (BCB, Febraban) para reforçar a demanda por automação financeira.
- **Pontos de análise:** como outros autores lidam com SLOs, testes de carga e pipelines IaC — conecte com o planejamento existente no repositório.

### 3. Fundamentação Teórica
- **Objetivo:** explicar os conceitos que suportam as decisões do projeto.
- **Sugestões de tópicos:**
  - Arquitetura serverless e responsabilidades compartilhadas (referenciar literatura sobre FaaS/containers gerenciados, balanceadores globais, CDN e filas serverless).
  - Clean Architecture, Domain-Driven Design e Action-Query-DTO (baseie-se em `docs/system-design.md`, `GEMINI.md` e nos diretórios `app/Actions`, `app/Queries`, etc.).
  - Práticas de observabilidade (OpenTelemetry, SLO/SLA) e engenharia de confiabilidade (SRE).
  - Conciliação bancária e métodos de orçamento (YNAB/buckets) descritos em `docs/features/*`.

### 4. Metodologia
- **Visão geral:** descreva como o trabalho foi conduzido do planejamento à validação.
- **Subseções sugeridas:**
  1. **Planejamento (docs/planning.md):** apresente premissas, SLOs (latência P95 ≤ 250 ms, erro ≤ 0,5%, disponibilidade ≥ 99,5%) e limites práticos do ambiente de containers (1 vCPU / 1 GiB por instância, `max-instances = 10`).
  2. **Implementação incremental:** cite o workflow Git, uso de Laravel/PHP 8.3, React/Vite, e como cada módulo foi desenvolvido com testes locais e pipelines.
  3. **Infraestrutura como código:** detalhe como o diretório `terraform/` e o `Makefile` orquestram ambientes, incluindo secret management e automações com os pipelines de CI/CD (GitHub Actions ou pipelines nativos da nuvem utilizados).
  4. **Planejamento e execução de testes:** explique a escolha do k6, apresente os scripts em `tests/k6/scenarios/*.js`, parâmetros dos estágios (até 1000 VUs) e como os resultados foram coletados (`csv` + `docs/test-results.md`). Inclua também o teste de processamento assíncrono descrito em `docs/tests/3-test-queue/README.md`, detalhando como 51,58 mil tarefas foram geradas e drenadas em aproximadamente 10 min.
- **Ferramentas e datasets:** mencione a stack de observabilidade da nuvem, o banco PostgreSQL gerenciado, o Redis utilizado como cache/lock, o servidor de WebSockets (Reverb) e os dados sintéticos criados para as simulações.

### 5. Implementação / Desenvolvimento
- **Estrutura narrativa:** do backend para o frontend, seguido dos pipelines e observabilidade.
- **Referências diretas:**
  - **Backend (`app/`, `routes/`, `resources/lang/`):** descreva actions, queries, DTOs e jobs (`app/Jobs/*`) que compõem importação de extratos, budgets e notificações.
  - **Frontend (`resources/js` ou SPA):** destaque componentes críticos (dashboards, telas de importação) e como consomem a API e os eventos Reverb.
  - **Infraestrutura (`terraform/`, `docker/`, `Makefile`):** explique módulos, variáveis sensíveis e políticas de segurança (VPC, Secrets, IAM mínimo necessário).
  - **Observabilidade:** dashboards e alertas definidos (mesmo que em texto) alinhados ao planejamento.
- **Dicas:** acrescente diagramas do `docs/system-design.md` e evidências de commits/pipelines que mostram a evolução da aplicação.

### 6. Resultados e Discussão
- **Apresente os experimentos:**
  - **Teste de leitura (19:07–19:25):** 1000 VUs, p95=158,48 ms, taxa de erro 0,00 % (cumpriu os SLOs). Destaque o throughput (470 req/s) e suponha impactos no banco relacional e no Redis.
  - **Teste de leitura e escrita (22:53–23:13):** 650 VUs, p95=4,03 s (SLO violado). Analise os gargalos observados (latência média 1,55 s, picos de 9,57 s) e discuta possíveis causas (limites do autoscaling de containers, contencioso no banco relacional, saturação de WebSockets).
  - **Teste de processamento assíncrono (01:08–01:18):** 51,58 mil tarefas na Cloud Tasks drenadas em aproximadamente 10 min, sem DLQ. Usar `docs/tests/3-test-queue/README.md` para relatar o setup (geração de jobs, observação da drenagem em tempo real) e correlacionar com a elasticidade dos workers.
- **Discussão:** conecte os resultados às premissas — o ambiente com `max-instances=10` e 1 vCPU impõe teto de ~900 RPS, conforme documentado em `docs/planning.md`. Proponha mitigadores (mais instâncias, particionamento de consultas, caching de contas/contatos, habilitar CPU always-on para os containers ou dedicar pods para workloads de escrita) e destaque que o teste de processamento assíncrono confirma a capacidade atual de drenar ~52 mil tarefas em 10 min, mas depende da mesma cota de instâncias, exigindo monitoramento para evitar backlog.
- **Visualizações:** inclua gráficos derivados dos CSVs (`transactions.csv`, `mix.csv`) ou métricas coletadas na plataforma de observabilidade para ilustrar a análise.

### 7. Conclusão e Trabalhos Futuros
- **Síntese:** retome objetivos e indique quais foram atingidos (documentação completa da arquitetura, execução de testes, identificação de limites).
- **Insights:** destaque que combinações bem planejadas de balanceamento, cache, filas, WebSockets e autoscaling conseguem sustentar workloads críticos quando guiadas por SLOs e testes contínuos.
- **Trabalhos futuros sugeridos:**
  1. Avaliar bancos distribuídos/escalares horizontais (NewSQL) para reduzir latências em cenários pesados de escrita.
  2. Introduzir um barramento de eventos e pipelines de streaming para fluxos analíticos em tempo real.
  3. Evoluir a automação de testes adicionando chaos engineering (Fault Injection) para o banco relacional, Redis e filas.
  4. Publicar um kit open-source com módulos Terraform e scripts k6 para replicação.

### 8. Referências
- **Categorias mínimas:**
  - Documentação oficial das plataformas utilizadas: balanceadores/CDN, gerenciamento de containers, filas serverless, armazenamento em objetos e Redis gerenciado.
  - Livros/Artigos sobre Clean Architecture, DDD, SRE e Resiliência em sistemas financeiros.
  - Trabalhos da SBC/IEEE sobre serverless e fintechs brasileiras.
  - Normas brasileiras (BACEN, LGPD) relacionadas à guarda e tratamento de dados sensíveis.
- **Estratégia:** crie uma tabela de rastreabilidade relacionando cada citação com a seção onde é usada. Garante aderência ao estilo bibliográfico exigido pelo evento escolhido (ABNT/IEEE).

---

## Quadro rápido de evidências do repositório

| Seção do artigo                     | Evidências / arquivos relevantes                                                                                 |
| ----------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Resumo, Introdução, Objetivos       | `docs/planning.md`, `docs/system-design.md`, `docs/features/*`, `README`, `GEMINI.md`                             |
| Trabalhos Relacionados / Fundamentação | Referências externas + alinhamento com princípios descritos em `docs/system-design.md` e `docs/features/*`       |
| Metodologia                         | `docs/planning.md`, `terraform/`, `docker/`, `Makefile`, `tests/k6/scenarios/*`, `docs/test-results.md`           |
| Implementação                       | `app/`, `resources/`, `routes/`, `database/`, `docs/features/*`, `docs/system-design.md`                          |
| Resultados                          | `docs/test-results.md`, `docs/tests/3-test-queue/README.md`, CSVs exportados pelos testes, métricas capturadas na plataforma de observabilidade (capturas a serem incluídas)   |
| Conclusão e Trabalhos Futuros       | Síntese das análises + backlog técnico (issues/roadmap)                                                           |
| Referências / Apêndices             | `docs/database-schema.md`, diagramas, scripts k6 e Terraform para reprodutibilidade                               |

Use este quadro para garantir que cada capítulo cite explicitamente onde as evidências podem ser verificadas dentro do repositório, fortalecendo a rastreabilidade acadêmica do TCC.
