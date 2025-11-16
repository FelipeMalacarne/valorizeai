# Diretrizes do TCC ValorizeAI

Este guia traduz a estrutura clássica da SBC para a realidade do projeto ValorizeAI. Use-o como checklist para manter coerência entre o texto, o código e as evidências já reunidas no repositório (especialmente `docs/planning.md`, `docs/system-design.md`, `docs/test-results.md`, `docs/features/*` e `tests/k6/scenarios/*`). Lembre-se de que o artigo completo deve ter **no máximo 25 páginas**, conforme exigência do evento.

---

## Introdução proposta

> **Texto base:**  
> Aplicações digitais que precisam reagir a múltiplas integrações, eventos contínuos e picos imprevisíveis dependem cada vez mais de arquiteturas que combinem elasticidade automática e observabilidade desde o primeiro commit. Processos manuais ou pipelines acoplados não conseguem acompanhar o ritmo de usuários que esperam interfaces unificadas, notificações instantâneas e consistência nos dados, independentemente do domínio atendido. O ValorizeAI nasce como um estudo de caso completo: uma aplicação web modular que centraliza fluxos de ingestão, processamento síncrono/assíncrono e entrega em tempo real usando uma stack moderna.
>
> A contribuição deste trabalho está em mostrar como uma arquitetura serverless/containerizada — com balanceamento global e CDN, containers que escalam horizontalmente sob demanda, um servidor dedicado de WebSockets (Reverb), pipelines assíncronos baseados em filas, cache Redis e buckets para armazenamento — se comporta frente a SLOs ambiciosos. O texto percorre cada bloco arquitetural adotado e evidencia, por meio de testes de carga com k6 e cenários de processamento assíncrono, até onde essa combinação se mantém eficiente. O foco não é o domínio financeiro em si, mas sim como desenhar, implementar e provar uma arquitetura plenamente observável e escalável que poderia sustentar qualquer produto transacional multiusuários.

## Justificativa

> **Texto base:**  
> Workloads transacionais que concentram ingestão massiva, estados compartilhados e interfaces colaborativas exigem consistência forte, rastreabilidade para auditoria e respostas instantâneas mesmo quando o tráfego varia abruptamente. Embora existam tutoriais pontuais sobre cada tecnologia, é raro encontrar material que conecte balanceadores/CDNs, camadas de cache, filas assíncronas, servidores de WebSockets e pipelines IaC aos resultados práticos de testes de performance. Ao construir o ValorizeAI end-to-end e registrar os experimentos de leitura, leitura e escrita (`docs/test-results.md`) e o teste de processamento assíncrono documentado em `docs/tests/3-test-queue/README.md`, este TCC evidencia como essas decisões se traduzem em métricas: o teste de leitura mantém a latência P95 em 158 ms, o de leitura e escrita revela gargalos quando há escrita intensa + streaming, e o teste de processamento assíncrono mostra que 51,58 mil tarefas foram drenadas em ~10 min. Documentar esse caminho, apoiado por infraestrutura como código e monitoramento de custo, fornece uma referência concreta para equipes que precisam justificar arquiteturas orientadas a eventos com elasticidade horizontal automática, independentemente do domínio.

## Objetivos

### Objetivo geral

Demonstrar, por meio de documentação técnica e experimentos de desempenho, que a arquitetura do ValorizeAI — composta por balanceador com CDN, containers escalados horizontalmente, processamento assíncrono em filas, servidor de WebSockets, buckets para artefatos e cache em Redis — sustenta os SLOs definidos para um produto transacional completo, mantendo todo o ciclo (modelagem, desenvolvimento, infraestrutura, observabilidade e testes) versionado no repositório.

### Objetivos específicos

1. **Mapear a arquitetura end-to-end**, destacando o papel do balanceador/CDN, das instâncias de containers, do servidor de WebSockets, das filas assíncronas, dos buckets de armazenamento e do Redis para garantir consistência e baixa latência (`docs/planning.md`, `docs/system-design.md`).
2. **Documentar o desenvolvimento do backend Laravel, do frontend React e dos fluxos síncronos/assíncronos**, com foco nos módulos críticos (ingestão de dados, automações, notificações e painéis em tempo real), aproveitando os registros em `docs/features/*`, `app/` e `resources/`.
3. **Planejar e executar os testes de carga** (k6, cenários de leitura e de leitura/escrita) e o teste de processamento assíncrono (`docs/tests/3-test-queue/README.md`) para validar horizontalmente a arquitetura frente aos SLOs e identificar gargalos usando os scripts em `tests/k6/scenarios/*`.
4. **Interpretar os resultados e propor otimizações**, relacionando desempenho, elasticidade e custo (ex.: ajustes de limites de instância, estratégias de cache e particionamento de consultas) e apontando como essas evidências fundamentam decisões para workloads transacionais de alta criticidade.

---

## Estratégia de coesão narrativa

- **Linha mestra:** cada seção deve abrir retomando a pergunta ou resultado apresentado anteriormente e fechar indicando qual questão será respondida na próxima parte. Use sempre referências cruzadas ao longo do texto (ex.: “Conforme discutido na Seção 4…”).
- **Eixo das evidências:** mantenha uma trilha explícita entre SLOs ⟶ decisões arquiteturais ⟶ implementação ⟶ testes ⟶ recomendações. As subseções abaixo já apontam quais arquivos do repositório suportam cada transição.
- **Gancho visual:** sempre que possível, termine cada seção com uma tabela/figura que antecipa dados utilizados na próxima etapa (diagramas chamando implementação, gráficos chamando discussão, etc.).
- **Checklist de retorno:** ao final de cada capítulo, valide se (1) os objetivos daquela seção foram respondidos e (2) qual insight alimenta a seção seguinte. Documente isso nos parágrafos de fechamento para manter o artigo amarrado.

---

## Guia por seção da estrutura SBC

### Resumo (Abstract)
- **Objetivo da seção:** Apresentar uma visão geral concisa do artigo.
- **Conteúdo obrigatório:** contextualização do problema, objetivo da pesquisa, metodologia empregada (infra como código + k6 + testes assíncronos), principais resultados (p95=158 ms na leitura, p95=4,03 s no mix, 51,58 mil tarefas drenadas em ~10 min) e conclusões sobre a escalabilidade da arquitetura ValorizeAI.
- **Fontes no repositório:** `docs/planning.md`, `docs/test-results.md`, `docs/tests/3-test-queue/README.md`.
- **Dicas:** escreva o resumo por último, quando todas as seções já estiverem revisadas; garanta que as conclusões mencionadas aqui sejam retomadas na Seção 7.
- **Gancho para a Introdução:** encerre com a pergunta central que orienta o artigo (“até onde essa arquitetura mantém os SLOs?”), preparando o leitor para o aprofundamento seguinte.

### 1. Introdução
- **Objetivo da seção:** Apresentar o problema, justificar a relevância e contextualizar o trabalho.
- **Conteúdo recomendado:**
  - Motivação: por que arquiteturas serverless/autoscaláveis merecem investigação (use números do mercado ou dores coletadas no repositório).
  - Descrição concisa do problema enfrentado pelo ValorizeAI.
  - Objetivos geral e específicos (reutilize a seção de objetivos).
  - Contribuições principais (arquitetura replicável, testes documentados, pipeline IaC completo).
  - Estrutura do artigo: breve roadmap dos capítulos.
- **Transição para Trabalhos Relacionados:** destaque as lacunas de literatura identificadas e explique por que uma revisão é necessária antes de detalhar a solução.

### 2. Trabalhos Relacionados / Revisão Bibliográfica
- **Objetivo da seção:** Mostrar o estado da arte e posicionar o artigo frente a outras abordagens.
- **Conteúdo recomendado:**
  - Revisão da literatura sobre serverless/container-managed + observabilidade.
  - Quadro comparativo entre abordagens (ex.: Kubernetes autogerenciado vs Cloud Run, diferentes estratégias de WebSockets/filas).
  - Identificação das lacunas (ausência de validação empírica com SLOs claros, pouca documentação de pipelines IaC completos, etc.).
  - Posicionamento do ValorizeAI: qual diferencial frente aos trabalhos discutidos.
- **Fontes sugeridas:** SBC, IEEE, ACM, relatórios de mercado sobre maturidade de serverless.
- **Transição para Fundamentação:** destaque quais conceitos técnicos precisam ser detalhados para suportar a proposta.

### 3. Fundamentação Teórica (opcional)
- **Objetivo da seção:** Apresentar conceitos técnicos/teóricos necessários para entender o restante do texto.
- **Conteúdo recomendado:**
  - Definições formais e modelos arquiteturais (serverless, autoscaling horizontal, Action/Query/DTO, Clean Architecture, DDD).
  - Tecnologias envolvidas: Laravel 12, React 19, Reverb, Redis, Postgres gerenciado, Cloud Run, Cloud Tasks.
  - Práticas de observabilidade e SRE (SLOs, SLIs, tracing).
- **Uso das fontes internas:** `docs/system-design.md`, `GEMINI.md`, `docs/features/*`, estrutura de diretórios (`app/Actions`, `app/Queries`, etc.).
- **Transição para Metodologia:** explique como esses conceitos guiam o planejamento experimental narrado a seguir.

### 4. Metodologia
- **Objetivo da seção:** Descrever como o estudo foi conduzido end-to-end.
- **Conteúdo recomendado:**
  1. Tipo de pesquisa (experimental/aplicada) e hipóteses avaliadas.
  2. Planejamento (docs/planning.md): premissas, SLOs (latência P95 ≤ 250 ms, erro ≤ 0,5%, disponibilidade ≥ 99,5%), limites de infraestrutura (`max-instances=10` etc.).
  3. Ferramentas e técnicas: Laravel/PHP 8.4, React/Vite, Terraform, Makefile, k6, Cloud Tasks, observabilidade nativa.
  4. Etapas: implementação incremental, IaC, preparação dos dados sintéticos, execução dos testes de carga e filas.
  5. Justificativa das escolhas (por que Cloud Run, por que k6, por que Redis, etc.).
- **Transição para Implementação:** deixe claro que a próxima seção detalha como essas etapas se materializaram em código, pipelines e ambientes.

### 5. Implementação / Desenvolvimento
- **Objetivo da seção:** Detalhar o processo de desenvolvimento e as escolhas técnicas realizadas.
- **Conteúdo recomendado:**
  - Ambiente de desenvolvimento: ferramentas, linguagens e plataformas utilizadas (Laravel, React, Vite, Docker, Terraform, pipelines CI/CD).
  - Arquitetura da implementação: módulos backend/frontend, jobs, filas, WebSockets, cache, persistência.
  - Decisões técnicas e justificativas (ex.: uso de Actions/Queries, Reverb para tempo real, Redis para cache/locks, Cloud Tasks para assíncrono).
  - Desafios e como foram superados (limites de instância, observabilidade, coordenação entre módulos).
  - Otimizações aplicadas (padrões de cache, particionamento de consultas, tuning do autoscaling, otimizações de bundle frontend).
  - Recursos necessários: configurações mínimas de hardware/software para reproduzir o ambiente.
- **Transição para Resultados:** destaque quais componentes serão estressados nos testes descritos a seguir e aponte para os scripts em `tests/k6/scenarios/*`.

### 6. Resultados e Discussão
- **Objetivo da seção:** Apresentar os resultados obtidos e interpretá-los criticamente.
- **Conteúdo recomendado:**
  - Dados coletados: tabelas/gráficos com métricas dos testes de leitura, mix e processamento assíncrono (`docs/test-results.md`, CSVs).
  - Análises: explicar comportamento do p95, throughput, taxa de erro; incluir comparações com SLOs e trabalhos anteriores.
  - Vantagens identificadas: onde a arquitetura superou as expectativas (ex.: leitura sustentando 1000 VUs sem erro).
  - Limitações: gargalos detectados (escrita intensa, saturação de WebSockets, cota de instâncias) e suas causas prováveis.
  - Discussão crítica: relacione resultados com premissas de planejamento e com as lacunas identificadas na revisão.
- **Visualizações:** gráficos derivados dos CSVs (`transactions.csv`, `mix.csv`), prints ou tabelas que reforcem a análise.
- **Transição para Conclusão:** encerre sinalizando como os achados respondem aos objetivos e quais pontos serão retomados em trabalhos futuros.

### 7. Conclusão e Trabalhos Futuros
- **Objetivo da seção:** Resumir contribuições e indicar direções futuras.
- **Conteúdo recomendado:**
  - Retomada dos objetivos e verificação do que foi cumprido.
  - Principais achados e impacto potencial do estudo.
  - Lista das contribuições efetivas (arquitetura, testes, IaC, observabilidade).
  - Sugestões de trabalhos futuros (NewSQL, barramento de eventos, chaos engineering, kit open-source).
- **Fecho com Referências:** destaque que as fontes citadas sustentam as afirmações e direcione o leitor para os apêndices com scripts/diagramas.

### 8. Referências
- **Objetivo da seção:** Listar todas as fontes citadas seguindo o padrão exigido pelo evento (ABNT ou IEEE).
- **Categorias mínimas:**
  - Documentação oficial das plataformas utilizadas.
  - Livros/artigos sobre arquiteturas distribuídas, Clean Architecture, DDD, SRE e resiliência.
  - Trabalhos acadêmicos (SBC/IEEE/ACM) sobre serverless, autoscaling e observabilidade.
  - Normas/regulações apenas quando fundamentarem requisitos.
- **Estratégia:** mantenha uma planilha/tabela de rastreabilidade indicando em qual seção cada citação é aplicada.

---

## Quadro rápido de evidências do repositório

| Seção do artigo                     | Evidências / arquivos relevantes                                                                                 |
| ----------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Resumo, Introdução, Objetivos       | `docs/planning.md`, `docs/system-design.md`, `docs/features/*`, `README`, `GEMINI.md`                             |
| Trabalhos Relacionados / Fundamentação | Referências externas (serverless, containers gerenciados, SRE) + alinhamento com princípios descritos em `docs/system-design.md` e `docs/features/*`       |
| Metodologia                         | `docs/planning.md`, `terraform/`, `docker/`, `Makefile`, `tests/k6/scenarios/*`, `docs/test-results.md`           |
| Implementação                       | `app/`, `resources/`, `routes/`, `database/`, `docs/features/*`, `docs/system-design.md`                          |
| Resultados                          | `docs/test-results.md`, `docs/tests/3-test-queue/README.md`, CSVs exportados pelos testes, métricas capturadas na plataforma de observabilidade (capturas a serem incluídas)   |
| Conclusão e Trabalhos Futuros       | Síntese das análises + backlog técnico (issues/roadmap)                                                           |
| Referências / Apêndices             | `docs/database-schema.md`, diagramas, scripts k6 e Terraform para reprodutibilidade e replicação da arquitetura serverless                               |

Use este quadro para garantir que cada capítulo cite explicitamente onde as evidências podem ser verificadas dentro do repositório, fortalecendo a rastreabilidade acadêmica do TCC. Nos parágrafos de transição, aponte sempre qual arquivo/experimento da linha anterior será retomado na próxima seção para manter o fluxo coeso.
