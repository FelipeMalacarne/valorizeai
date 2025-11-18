# Modelo NoSQL para o ValorizeAI v2

## Objetivos do redesenho
- Alinhar o backend a serviços gerenciados no Google Cloud (Cloud Run + Firestore/Mongo Atlas on GCP) eliminando a dependência do Cloud SQL.
- Garantir multi-tenancy rígido por usuário e manter a compatibilidade com o padrão Action-Query-DTO + Value Objects da aplicação.
- Simplificar ingestão de eventos (importação OFX/CSV) e relatórios agregados de orçamento mantendo consultas em tempo quase real.

## Requisitos e restrições principais
1. **Escopo do domínio:** usuários, contas, transações, importações, categorias, orçamentos e notificações. O restante (jobs, cache, tokens pessoais) pode continuar nas soluções nativas de fila/cache do Laravel.
2. **Consistência:** hoje usamos transações SQL para garantir saldos e importações idempotentes. Em NoSQL devemos manter consistência lógica via agregados + eventos compensatórios envolvendo Cloud Tasks/PubSub.
3. **Volume esperado:** importações podem inserir milhares de transações por usuário. Dokumentos devem permanecer < 1MB (limite do Firestore) e evitar hot partitions.
4. **Consultas críticas:**
   - Listar contas e saldos por usuário.
   - Listar/filtrar transações por data, categoria, status de importação.
   - Dashboards mensais (somatórios por categoria, orçamento vs gasto).

## Estratégia geral de modelagem
- **Coleções por agregado:** cada módulo principal vira uma coleção de documentos normalizados, com referências leves (`accountId`, `categoryId`) ao invés de subdocumentos gigantes. Apenas detalhes pequenos (splits, histórico de revisão) são embutidos.
- **Particionamento lógico:** prefixamos IDs com o `userId` (ex.: `usr_123:acc_456`) para Mongo e usamos campos de filtro (`userId`, `accountId`) que sempre entram em índices compostos. No Firestore podemos manter coleções raiz (`accounts`, `transactions`, etc.) com filtros obrigatórios por `userId` ou usar subcoleções em `users/{userId}` caso se queira reforçar o isolamento físico.
- **Schema versionado:** cada documento leva `schemaVersion` e `audit` (criado/atualizado por). Isso facilita migrações futuras sem alterações complexas de collection.
- **Valores monetários:** continuamos armazenando inteiros em centavos com o código de moeda, mantendo compatibilidade com `Money` Value Object.

## Coleções propostas

| Tabela SQL | Coleção/Documento | Notas |
| --- | --- | --- |
| `users` | `users` | Documento leve com perfil + preferências. Subcoleções opcionais (`settings`, `security`). |
| `banks` | `banks` | Catálogo global (read-mostly). Pode ser pré-populado via Seeder para ambos os bancos de dados. |
| `accounts` | `accounts` (root) ou `users/{userId}/accounts` | Referencia `bankId`, mantém campos calculados (saldo atual, saldo reconciliado) atualizados por triggers/Cloud Functions. |
| `categories` | `categories` | `isDefault=true` para pré-definidas globais. Customizadas incluem `userId`. |
| `transactions` | `transactions` com array `splits[]` | Guarda `accountId`, `categoryId`, status de importação e metadados de reconciliação. Splits embutidos com `categoryId` próprio. |
| `imports` + `import_transactions` | `imports` (documento mestre) + subcoleção `items` | Cada importação tem snapshot do arquivo + progresso. `items` mantém preview e link opcional (`matchedTransactionId`). |
| `budgets`, `budget_allocations`, `budget_monthly_configs` | `budgets` (config estática) + subcoleções `allocations` (por mês) e coleção separada `monthlySummaries` | Permite consultas agregadas por mês/usuário sem percorrer todos os budgets. |
| `notifications` | `notifications` | Usa padrão inbox: documento com `userId`, `payload`, `status`. Pode morar também em Firestore `users/{userId}/notifications`. |
| `personal_access_tokens`, `sessions`, `jobs`, `cache` | Serviços nativos | Continuamos utilizando Redis/Cloud Tasks/Passport ou migramos para soluções gerenciadas; não entram no escopo NoSQL.

### Estrutura dos documentos (exemplos mínimos)

```jsonc
// users/{userId}
{
  "id": "usr_123",
  "name": "Ana Souza",
  "email": "ana@example.com",
  "preferredCurrency": "BRL",
  "featureFlags": { "betaBudgets": true },
  "schemaVersion": 1,
  "createdAt": "2025-05-01T12:00:00Z",
  "updatedAt": "2025-05-07T14:12:00Z"
}
```

```jsonc
// accounts collection
type AccountDoc = {
  _id: "usr_123:acc_001",
  userId: "usr_123",
  bankId: "bb",
  name: "Conta Corrente",
  number: "1234",
  currency: "BRL",
  type: "checking",
  balance: 152300,          // saldo atual (cents)
  clearedBalance: 140000,   // saldo reconciliado
  lastStatementAt: "2025-06-01T00:00:00Z",
  schemaVersion: 2,
  createdAt: ...,
  updatedAt: ...
}
```

```jsonc
// transactions collection
type TransactionDoc = {
  _id: "usr_123:txn_890",
  userId: "usr_123",
  accountId: "usr_123:acc_001",
  status: "posted",
  source: { type: "manual", importId: null },
  currency: "BRL",
  type: "debit",
  amount: 4899,
  date: "2025-06-13T10:05:00Z",
  memo: "Padaria",
  categoryId: "usr_123:cat_food",
  splits: [
    { id: "split_1", categoryId: "usr_123:cat_food", amount: 3899 },
    { id: "split_2", categoryId: "usr_123:cat_tip", amount: 1000 }
  ],
  review: { locked: false, reconciledAt: null },
  schemaVersion: 3,
  createdAt: ...,
  updatedAt: ...
}
```

```jsonc
// imports/{importId}
{
  _id: "usr_123:imp_777",
  userId: "usr_123",
  fileName: "junho2025.ofx",
  extension: "ofx",
  status: "pending_review",
  counters: { new: 42, matched: 10, conflicted: 4 },
  sourceBucketPath: "imports/2025/06/xyz",
  startedAt: "2025-06-15T08:00:00Z",
  completedAt: null,
  schemaVersion: 1
}
// imports/{importId}/items/{itemId}
{
  amount: 12500,
  currency: "BRL",
  memo: "Spotify",
  date: "2025-06-10",
  fitid: "20250610-abc",
  status: "matched",
  matchedTransactionId: "usr_123:txn_650",
  suggestedCategoryId: "usr_123:cat_subscriptions"
}
```

```jsonc
// budgets/{budgetId}
{
  _id: "usr_123:bdg_groceries",
  userId: "usr_123",
  categoryId: "usr_123:cat_food",
  name: "Alimentação",
  currency: "BRL",
  rules: { rollover: true, maxPercentIncome: 0.3 }
}
// budgets/{budgetId}/allocations/{month}
{
  month: "2025-06-01",
  budgetedAmount: 200000,
  spentAmount: 153400,
  availableAmount: 46600,
  rollovers: { fromPrevious: 12000 }
}
```

## Índices e padrões de consulta
- **Todos os documentos transacionais** precisam de índice composto `userId + date` para dashboards mensais. Em Mongo: `{ userId: 1, date: -1 }`. Em Firestore: índice composto `userId ASC, date DESC` + outro para `categoryId+date` (espelhando os índices SQL atuais).
- **Accounts**: índice `userId + type` para filtros por categoria de conta. Em Firestore os filtros já exigem índice composto.
- **Imports**: índice `userId + status` para filas de revisão, e `items` com `fitid` único por usuário para idempotência (pode ser TTL + unique constraint em Mongo, ou mecanimo de deduplicação via Cloud Function em Firestore).
- **Budgets**: índices `userId + month` tanto em `allocations` quanto em `monthlySummaries` para gerar dashboards anualizados sem agregações caras.

## Interoperabilidade MongoDB vs Firestore
| Aspecto | MongoDB Atlas | Firestore |
| --- | --- | --- |
| Estrutura sugerida | Coleções raiz globais com chaves compostas; transações multi-doc com `session` quando necessário. | Subcoleções por usuário para reforçar multi-tenancy ou coleções globais com filtros obrigatórios. Transactions limitadas a 500 docs. |
| Consistência | Dá suporte a transações ACID multi-documento na mesma replica set/cluster. Útil para reconciliar saldo de conta. | Transações ACID limitadas mas suficientes para atualizar `accounts` + `transactions` ao mesmo tempo (até 25 writes). |
| Indexes | Pode criar índices TTL (útil p/ import preview). | Precisa declarar índices compostos antecipadamente; sem TTL direto (usar `expireAt` + Cloud Function). |
| Pipelines | Aggregation Pipeline nativa para relatórios. | Usar BigQuery Federation ou Cloud Functions para gerar agregados; manter `monthlySummaries` atualizada evita agregações caras. |

## Alterações na aplicação Laravel
1. **Camada de Persistência:** introduzir interfaces (ex.: `AccountsRepository`, `TransactionsQuery`) implementadas por drivers SQL e NoSQL. Mantém Actions/Queries atuais quase intactas.
2. **DTOs/Resources:** continuam iguais; apenas a hidratação passa a usar documentos (`Spatie Data` já suporta arrays). Value Objects (Money, Currency) seguem iguais.
3. **Transações:** substituir `DB::transaction()` por serviços específicos. Sugestão: `TransactionRunner` com implementações `SqlTransactionRunner` e `FirestoreTransactionRunner`/`MongoTransactionRunner` para preservar assinatura atual das Actions.
4. **Eventos & Jobs:** Cloud Tasks/Queues continuam iguais. Para Firestore, considerar Cloud Functions para atualizar índices derivados (saldos, monthly summaries) quando `transactions` sofrerem alterações.
5. **Search e filtros:** Queries complexas hoje feitas via SQL + `whereBetween` serão traduzidas para pipelines com limites de paginação (`limit/offset` não existe em Firestore; usar `startAfter` + `orderBy`).

## Estratégia de migração
1. **Fase 0 – Dual-write opcional:** habilitar drivers que gravam em SQL + NoSQL via feature flag, garantindo consistência antes da migração.
2. **Fase 1 – Leitura sombra:** Queries críticos (dashboard, lista de transações) passam a ler do NoSQL em background (comparar resultados, logs no Prometheus/Stackdriver).
3. **Fase 2 – Cutover:** apontar Actions/Queries primárias para o driver NoSQL, mantendo SQL como fallback apenas para exportação histórica.
4. **Fase 3 – Cleanup:** desligar migrations SQL, remover dependências de Cloud SQL do Terraform e atualizar pipelines (`make deploy`, `make run_migration`) para usar inicialização das collections (ex.: scripts `php artisan nosql:seed-banks`).

## Próximos passos
1. Definir se o alvo será Firestore (nativo GCP) ou MongoDB Atlas (maior flexibilidade em pipelines). Isso influencia limites de transação e preço.
2. Implementar camada de repositórios e um driver fake (in-memory) para validar a API antes de conectar ao banco real.
3. Escrever provas de conceito para duas consultas críticas: `ListTransactionsQuery` (filtros + paginação) e `BudgetOverviewQuery` (agregação por mês).
4. Medir impacto em importações grandes (ex.: 10k linhas) simulando writes em lote + Cloud Tasks, ajustando partições (`userId` como shard key) para evitar hotspots.
5. Atualizar `docs/database-schema.md` após validar os nomes finais das coleções e campos.
