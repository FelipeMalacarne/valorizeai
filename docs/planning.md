# 📘 Plano de TCC – ValorizeAI em Arquitetura Serverless Gerenciada no GCP

## 🎯 Tema e Objetivos

**Tema:** Documentar e validar a escalabilidade e a alta disponibilidade do aplicativo financeiro **ValorizeAI** utilizando exclusivamente serviços gerenciados do Google Cloud (Cloud Run, Cloud SQL, Memorystore, Cloud Tasks, Cloud Load Balancing).

**Objetivos específicos**

1. Descrever a arquitetura completa do ValorizeAI destacando como cada serviço gerenciado contribui para escalabilidade, segurança e observabilidade.
2. Definir SLOs viáveis (latência, disponibilidade e throughput) e demonstrar, via experimentos, que o ValorizeAI consegue atingi-los.
3. Registrar o processo de implementação (Terraform + GitHub Actions/Cloud Build) e os testes de validação para que seja possível reproduzir o ambiente a partir do repositório atual.

**Perguntas de pesquisa**

* Qual é a capacidade máxima (RPS) que a API em Cloud Run suporta antes de violar o SLO de latência?
* Como a combinação Cloud Run + Cloud SQL + Memorystore se comporta diante de falhas controladas (reinício da instância primária, indisponibilidade momentânea do cache)?
* O pipeline assíncrono (Cloud Tasks → Worker Cloud Run) mantém consistência e tempo de processamento adequado sob backlog ampliado?

> **Nota metodológica:** o foco é demonstrar que o ValorizeAI, apoiado em serviços gerenciados do GCP, cumpre os SLOs definidos. Não há pretensão de compará-lo com soluções self-managed ou provar superioridade frente a outras clouds.

---

## ✅ Premissas

* Workload HTTP/HTTPS com picos ocasionais (campanhas financeiras).
* Trilha de auditoria e consistência forte para transações críticas.
* Requisitos de experiência em tempo real (notificações via Reverb/WebSockets).
* Equipe pequena (autor do TCC) com necessidade de produtividade alta → foco em serviços gerenciados para reduzir toil operacional.

**SLOs base**

| Métrica                 | Valor alvo |
| ----------------------- | ---------- |
| Latência P95 (API)      | ≤ 250 ms   |
| Erro percentual         | ≤ 0.5%     |
| Disponibilidade mensal  | ≥ 99.5%    |
| MTTR falha planejada    | ≤ 60 s     |

---

## ☁️ Arquitetura Proposta (Managed GCP)

### 🔹 Edge / Rede

* **Cloud Load Balancing (HTTP(S))** com **Cloud CDN** e **Cloud Armor** (WAF/rate limit).
* Certificados gerenciados e roteamento custom domain (`valorizeai.*`).

### 🔹 Aplicação (Cloud Run)

| Serviço                         | Plataforma        | Observações                                                                    |
| ------------------------------- | ----------------- | ------------------------------------------------------------------------------ |
| API Laravel                     | Cloud Run         | Stateless; concurrency 80; VPC Connector para acessar Cloud SQL/Memorystore.   |
| Laravel Reverb / WebSockets     | Cloud Run         | Mín 1 instância; escala horizontal; utiliza Memorystore como backend.          |
| Workers HTTP (Cloud Tasks)      | Cloud Run         | Endpoint privado recebe push das filas; idempotência via Redis/outbox.         |
| Jobs agendados                  | Cloud Run Jobs    | Disparados por Cloud Scheduler (cron diários, limpeza, relatórios).            |

### 🔹 Dados e Cache

| Serviço           | Uso principal                                          | Configuração                                      |
| ----------------- | ------------------------------------------------------ | ------------------------------------------------- |
| **Cloud SQL (PostgreSQL)** | Banco transacional; primária + réplica de leitura (RO) | HA, backups automáticos, TLS obrigatório.         |
| **Memorystore (Redis)**    | Cache, filas curtas, backend do Reverb            | Tier Standard; failover automático; VPC privada.  |
| **Cloud Storage**          | Uploads, relatórios, snapshots de testes          | Bucket versionado com CMEK e TTL para temporários. |

### 🔹 Mensageria / Processamento Assíncrono

* **Cloud Tasks**: filas por domínio (ex.: `payments`, `notifications`), com política de retry e DLQ (Pub/Sub) para observação.
* **Pub/Sub (opcional)**: usado apenas para broadcast de eventos que não exigem confirmação imediata (ex.: log de auditoria). Pode ser adiado se não der tempo.

### 🔹 Observabilidade

* **Cloud Monitoring + Logging + Trace** integrados via OpenTelemetry.
* Dashboards com métricas-chave: latência P95/P99, taxa de erro, consumo de Cloud SQL, conexões Redis, backlog Cloud Tasks.
* Alertas básicos (latência > 250 ms, backlog > 5k jobs, uso CPU Cloud SQL > 80%).

### 🔹 Segurança

* IAM mínimo necessário, **Secret Manager** para segredos (creds DB, Resend, etc.).
* **VPC Connector** para Cloud Run → Cloud SQL/Memorystore.
* Auditoria via Cloud Audit Logs.

### 🔹 Infraestrutura como Código

```
terraform/
  main.tf                      # módulos cloudrun, load balancer, secrets
  modules/
    cloudrun/
    load-balancer/
  ...
```

* Terraform existente continuará sendo usado; ajustes focam em parametrizar Cloud SQL/Memorystore (provisionados fora do repo ou via módulos simples).
* Pipeline: GitHub Actions → build container → deploy Cloud Run → execução de smoke tests.

---

## 🧠 Hipóteses e Testes

### Hipóteses

1. **Escalabilidade da API Cloud Run**  
   * **H₀₁:** Antes de atingir 2k RPS, a latência P95 excede 250 ms ou a taxa de erros passa de 0,5%.  
   * **H₁₁:** A API mantém os SLOs até 2k RPS.
2. **Resiliência do plano de dados**  
   * **H₀₂:** Falhas controladas (failover Cloud SQL, reset de Memorystore) causam indisponibilidade > 60 s ou perda de requisições.  
   * **H₁₂:** O app se recupera em < 60 s e mantém consistência.
3. **Processamento assíncrono (Cloud Tasks)**  
   * **H₀₃:** Um backlog 10× maior não é drenado em < 5 min ou gera duplicidade de jobs.  
   * **H₁₃:** O worker Cloud Run processa o backlog com idempotência e dentro do tempo alvo.
4. **Observabilidade/Custo básico**  
   * **H₀₄:** Durante os testes, não há dados suficientes para provar SLOs ou o custo extrapola o orçamento definido.  
   * **H₁₄:** Os dashboards capturam todas as métricas necessárias e o custo permanece dentro do planejado.

### Matriz de testes

| # | Hipótese | Objetivo                        | Cenário / Procedimento                                                                 | Métricas principais                             | Ferramentas                                  | Critério de sucesso                                      |
| - | -------- | ------------------------------- | -------------------------------------------------------------------------------------- | ----------------------------------------------- | -------------------------------------------- | -------------------------------------------------------- |
| 1 | H₀₁ vs H₁₁ | Escalabilidade da API          | k6/Locust gerando ramp-up 0→2k RPS na rota `/api/v1/...`; Cloud Run escalando até limite | Latência P95, P99, throughput, erro %            | k6 + Cloud Monitoring                        | P95 ≤ 250 ms, erro % ≤ 0.5 até 2k RPS                    |
| 2 | H₀₂ vs H₁₂ | Falha em Cloud SQL / Redis     | Forçar failover manual no Cloud SQL + reiniciar Memorystore                            | MTTR, erro %, número de reconexões              | gcloud sql failover, Cloud Monitoring         | MTTR ≤ 60 s, erro % < 1%, aplicação retoma conexões      |
| 3 | H₀₃ vs H₁₃ | Backlog Cloud Tasks            | Injetar 10× jobs (ex.: 10k notificações), suspender/retomar worker Cloud Run           | Tempo para zerar fila, jobs DLQ, duplicidade    | Cloud Tasks metrics, Cloud Logging            | Backlog drenado ≤ 5 min, DLQ ≤ 0.5%, duplicidade inexistente |
| 4 | H₀₄ vs H₁₄ | Observabilidade/Custo          | Revisar dashboards/alertas durante testes + estimar custo diário (Billing export)      | Métricas coletadas, custo por 1k req            | Cloud Monitoring, Billing Export → BigQuery  | Todas as métricas coletadas + custo dentro do orçamento  |

---

## ✍️ Estrutura Proposta do TCC

1. **Introdução** – Contexto do ValorizeAI, problema, objetivos e perguntas de pesquisa.  
2. **Trabalhos Relacionados** – Aborda arquiteturas serverless em nuvem, referências sobre Cloud Run/Cloud SQL.  
3. **Fundamentação Teórica** – Conceitos de serverless, filas assíncronas, SLO/SLA, observabilidade.  
4. **Produto ValorizeAI** – Personas, fluxos críticos, requisitos funcionais/não funcionais.  
5. **Arquitetura Serverless no GCP** – Descrição detalhada dos serviços usados, diagramas e justificativas.  
6. **Metodologia e Plano Experimental** – Ambientes, ferramentas, scripts e hipóteses.  
7. **Implementação e Infraestrutura** – Terraform, pipeline CI/CD, configurações da aplicação.  
8. **Experimentos e Resultados** – Execução dos testes 1–4, análise dos dados, aceitação/rejeição das hipóteses.  
9. **Discussão e Limitações** – Lições aprendidas, riscos, possíveis otimizações futuras (ex.: GKE).  
10. **Conclusão** – Resumo das contribuições e recomendações.

---

## 🗓️ Cronograma (3 semanas)

| Semana | Foco                                 | Detalhes                                                                 |
| ------ | ------------------------------------ | ------------------------------------------------------------------------ |
| 1      | Infra & Documentação                  | Ajustar Terraform existente, provisionar Cloud SQL/Memorystore, atualizar docs, iniciar capítulos 1–5. |
| 2      | Testes & Observabilidade              | Configurar k6, scripts de failover, dashboards; rodar testes 1 e 2; escrever capítulos 6–8 (parcial). |
| 3      | Processamento assíncrono + Escrita    | Rodar teste 3 e 4, consolidar resultados, finalizar capítulos 8–10, revisão geral. |

---

## 💡 Próximos Passos

1. Atualizar Terraform para parametrizar Cloud SQL/Memorystore (ou documentar provisioning manual caso já existam).  
2. Garantir que Cloud Run (API + workers) esteja usando segredos do Secret Manager e conectores VPC.  
3. Preparar scripts de teste (k6, failover, injeção Cloud Tasks) e dashboards no Cloud Monitoring.  
4. Iniciar a escrita dos capítulos 1–5 usando este documento como guia, incrementando conforme testes avançarem.

---

## 🧪 Plano de Testes com k6

### Objetivos

1. Validar os SLOs definidos (latência P95 ≤ 250 ms, erro ≤ 0,5%) para as rotas críticas da API.  
2. Medir a capacidade máxima de RPS sustentado em Cloud Run antes de violar os SLOs.  
3. Obter insumos para o capítulo de “Experimentos e Resultados” (gráficos, tabelas, logs).

### Escopo Inicial

| Cenário | Rota / Fluxo                                                | Objetivo principal                            | Duração | Carga alvo (Stg → Prod) |
| ------- | ----------------------------------------------------------- | --------------------------------------------- | ------- | ----------------------- |
| C1      | `POST /api/token` (login) + `GET /api/accounts`             | Medir latência de autenticação + listagem     | 10 min  | 50→150 → **400** RPS    |
| C2      | `POST /api/transactions`                                    | Validar criação de transações sob pico        | 15 min  | 25→120 → **300** RPS    |
| C3      | `GET /api/dashboard` (ou `/dashboard` SSR)                  | Observar endpoints mais pesados de leitura    | 15 min  | 10→60 → **120** RPS     |
| C4      | Mix (50% `GET /api/transactions`, 30% `POST /api/transactions`, 20% `GET /api/accounts`) | Emular tráfego realista com mix read/write | 20 min  | 30→100 → **350** RPS    |

> Ajustar rotas conforme os novos controladores API. Ambientes de staging começam com as cargas menores; em produção, as fases finais devem atingir as metas em negrito.  
> O cenário C4 garante metade do tráfego em `GET /api/transactions` e a outra metade dividida entre `POST /api/transactions` e `GET /api/accounts`, cobrindo leitura e escrita no mesmo domínio.

### Organização do Projeto k6

```
tests/k6/
  README.md                  # instruções de execução
  env.example                # variáveis (BASE_URL, TOKEN, etc.)
  scenarios/
    accounts.js
    transactions.js
    mix.js
  helpers/
    auth.js                  # função para obter token via Sanctum
    metrics.js               # registradores customizados
```

### Estrutura de Script (exemplo)

```js
import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 50 },
    { duration: '5m', target: 150 },
    { duration: '3m', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<250'],
    http_req_failed: ['rate<0.005'],
  },
};

export default function () {
  const res = http.get(`${__ENV.BASE_URL}/api/accounts`, {
    headers: { Authorization: `Bearer ${__ENV.TOKEN}` },
  });

  check(res, {
    'status 200': (r) => r.status === 200,
  });

  sleep(1);
}
```

### Variáveis e Segredos

| Variável      | Descrição                                | Origem                         |
| ------------- | ---------------------------------------- | ------------------------------ |
| `BASE_URL`    | URL pública do Cloud Run / Load Balancer | `.env` local ou Secret Manager |
| `TOKEN`       | Token gerado via `/api/tokens`           | Criar usuário de teste         |
| `ACCOUNT_ID`  | ID fixo para cenários POST               | Preenchido via script setup    |

No `README` incluir instruções para gerar o token automaticamente (ex.: rodar `php artisan user:token` ou chamar endpoint de login via script `setup()` no k6).

### Execução

```bash
cd tests/k6
cp env.example .env          # preencher valores
export $(xargs < .env)
k6 run scenarios/accounts.js
```

Para execuções automatizadas (CI/CD ou Cloud Build), usar `k6 run --out cloud` ou integrar com o k6 Cloud se houver licença. Também registrar métricas no Cloud Monitoring via `otel collector` (opcional).

### Coleta e Análise

* Armazenar o CSV de resultados (`k6 run --out csv=out/accounts.csv`).  
* Gerar gráficos a partir do CSV (Planilha ou Grafana).  
* Comparar P95/P99 com os SLOs e documentar no capítulo de resultados.  
* Correlacionar com logs do Cloud Run / Cloud Monitoring (ex.: screenshot de dashboard de CPU/RPS durante o teste).

### Próximos Passos Específicos

1. Criar diretório `tests/k6` seguindo a estrutura proposta.  
2. Escrever `README.md` com preparo de ambiente (Credenciais, Base URL, geração de token).  
3. Implementar o primeiro cenário (C1) e executar contra ambiente de staging.  
4. Registrar métricas e ajustar thresholds antes de rodar os demais cenários.  
5. Automatizar a coleta (CSV + dashboards) para uso no TCC.
