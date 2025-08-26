# Funcionalidade: Conciliação Bancária

## 1. Visão Geral

A conciliação bancária é uma funcionalidade crucial para permitir que os usuários importem suas transações de forma rápida e segura, evitando a entrada manual de dados e mantendo seus registros financeiros sempre atualizados.

O sistema suportará a importação de arquivos **OFX (Open Financial Exchange)** e **CSV (Comma-Separated Values)**.

## 2. Histórias de Usuário

- **Como usuário,** eu quero poder fazer o upload de um arquivo de extrato (OFX ou CSV) do meu banco para importar minhas transações automaticamente.
- **Como usuário,** eu quero que o sistema identifique e previna a criação de transações duplicadas, comparando as transações importadas com as já existentes.
- **Como usuário,** eu quero ter uma tela de revisão para aprovar, editar ou rejeitar as transações importadas antes que elas sejam salvas permanentemente na minha conta.
- **Como usuário,** ao importar um arquivo CSV, eu quero poder mapear as colunas do arquivo (ex: "Data", "Valor", "Descrição") para os campos corretos do sistema.

## 3. Processo de Importação

O fluxo de importação foi desenhado para ser robusto e permitir que o usuário gerencie múltiplas importações de arquivos.

1.  **Início da Importação:** O usuário seleciona a conta de destino e faz o upload do arquivo. O sistema cria um registro na tabela `imports` com o status `processing`.
2.  **Parsing e Staging:** O backend analisa o arquivo, extrai as transações e salva cada uma na tabela `import_transactions`, vinculada ao `import` recém-criado. Cada transação começa com o status `pending`.
3.  **Identificação de Duplicatas:** Um processo em background compara cada transação em `import_transactions` com as transações já existentes na tabela `transactions`. 
    - Se uma correspondência forte for encontrada (usando `fitid` ou uma combinação de data, valor e descrição), o status da transação pendente é atualizado para `matched` e o `matched_transaction_id` é preenchido.
4.  **Fim do Processamento:** Após a análise de todas as transações, o status do `import` é atualizado para `pending_review`.
5.  **Revisão do Usuário:** O usuário acessa uma tela que lista todos os seus `imports` pendentes. Ao selecionar um, ele vê todas as `import_transactions` associadas e pode:
    - **Aprovar:** Mudar o status para `approved`.
    - **Rejeitar:** Mudar o status para `rejected`.
    - **Editar:** Ajustar dados como categoria ou descrição antes de aprovar.
6.  **Finalização:** O usuário clica em "Finalizar Importação". Uma `Action` processa todas as transações com status `approved`, movendo-as para a tabela `transactions` e, em seguida, o status do `import` é atualizado para `completed`.

## 4. Implementação no Backend

- **Models:**
    - `Import`
    - `ImportTransaction`

- **Controller:** `ImportController` para gerenciar os processos de importação.

- **DTOs:**
    - `ImportData`: Para receber o arquivo e o `account_id`.
    - `ImportTransactionData`: Para estruturar os dados de cada transação na fase de staging.

- **Actions:**
    - `CreateImportAction`: Recebe o upload, cria o registro na tabela `imports`, e dispara um Job para processar o arquivo.
    - `ProcessImportedTransactionsAction`: Ação final que é chamada quando o usuário clica em "Finalizar". Ela pega todas as `import_transactions` aprovadas de um `import` e as salva na tabela `transactions`.
    - `UpdateImportTransactionStatusAction`: Uma ação para a tela de revisão, que permite atualizar o status de uma única `import_transaction` (ex: de `pending` para `approved` ou `rejected`).

- **Jobs:**
    - `ProcessBankStatementFileJob`: Um job que roda em background. Ele é responsável por fazer o parsing do arquivo (usando `OfxParserService` ou `CsvParserService`) e pela lógica de identificação de duplicatas.

- **Services (Serviços):
    - `OfxParserService`: Responsável por interpretar arquivos OFX.
    - `CsvParserService`: Responsável por interpretar arquivos CSV, incluindo a lógica de mapeamento de colunas.

## 5. Implementação no Frontend

- **Página de Importação (`/import`):** Uma página onde o usuário pode selecionar a conta e arrastar ou selecionar o arquivo de extrato.
- **Componente de Mapeamento de CSV:** Um modal ou passo no fluxo que será exibido se o arquivo for um CSV, permitindo que o usuário associe as colunas do arquivo aos campos do sistema.
- **Página de Revisão (`/import/review`):** Uma tabela ou lista que exibe as transações importadas, com status claros (Nova, Duplicada), permitindo que o usuário aprove ou descarte cada uma delas individualmente ou em lote.
