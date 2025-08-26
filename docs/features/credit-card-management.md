# Funcionalidade: Gestão de Cartões de Crédito

## 1. Visão Geral

Esta funcionalidade permite que os usuários gerenciem seus cartões de crédito de forma integrada ao restante de suas finanças. O sistema tratará cartões de crédito como um tipo especial de conta, com lógica para lidar com faturas, limites e pagamentos.

## 2. Histórias de Usuário

- **Como usuário,** eu quero poder adicionar meus cartões de crédito como um tipo de conta, informando o limite e o dia de fechamento da fatura.
- **Como usuário,** eu quero que todas as minhas compras no cartão de crédito apareçam como transações normais, vinculadas à sua respectiva categoria de despesa e orçamento.
- **Como usuário,** eu quero que o sistema agrupe automaticamente minhas transações em faturas mensais com base no ciclo do meu cartão.
- **Como usuário,** eu quero poder visualizar minhas faturas (atuais e passadas) e ver claramente o saldo devedor e a data de vencimento.
- **Como usuário,** eu quero poder registrar facilmente o pagamento da minha fatura, que deve ser tratado como uma transferência de uma conta (ex: corrente) para a conta do cartão de crédito.

## 3. Modelo de Dados

- **`accounts`**: Contas com `type = 'credit'` representarão os cartões de crédito. Serão adicionados dois novos campos a esta tabela (a serem atualizados no `database-schema.md`):
    - `credit_limit` (`bigint`): O limite total do cartão em centavos.
    - `statement_closing_day` (`integer`): O dia do mês em que a fatura fecha (ex: 25).
- **`transactions`**: As compras no cartão são `transactions` normais, com `type = 'debit'`, vinculadas à conta do cartão.
- **`credit_card_statements`**: Esta tabela, conforme definida no schema, armazenará o registro histórico de cada fatura fechada.

## 4. Lógica do Backend

- **Pagamento da Fatura como Transferência:** O pagamento de uma fatura não é uma despesa, mas sim uma transferência de dinheiro entre contas. Ele não afeta o orçamento (a despesa já foi contabilizada no momento da compra). A implementação será:
    1. Uma transação de saída (débito) na conta de origem (ex: conta corrente).
    2. Uma transação de entrada (crédito) na conta do cartão de crédito, abatendo o saldo devedor.

- **Actions:**
    - `CreateCreditCardAccountAction`: Para criar uma `account` do tipo `credit` com os campos adicionais.
    - `CreateTransferAction`: Uma ação genérica para transferir valores entre duas contas do usuário. Será usada para o pagamento da fatura.
    - `CloseCreditCardStatementAction`: Uma ação, provavelmente executada por um job agendado, que irá:
        1. Identificar os cartões que precisam ter a fatura fechada no dia.
        2. Calcular o saldo total das transações desde o último fechamento.
        3. Criar uma nova entrada na tabela `credit_card_statements` com os totais e as datas.

- **Jobs Agendados:**
    - `GenerateCreditCardStatementsJob`: Um job que rodará diariamente para chamar a `CloseCreditCardStatementAction` para os cartões aplicáveis.

- **Queries:**
    - `CreditCardDetailsQuery`: Para obter os detalhes de um cartão, incluindo saldo atual, limite disponível e informações da fatura aberta.
    - `ListCreditCardStatementsQuery`: Para listar todas as faturas (abertas e fechadas) de um cartão.

## 5. Implementação no Frontend

- **Página de Cartões de Crédito:** Uma área dedicada para listar todos os cartões, mostrando um resumo de cada um (saldo, limite, vencimento da fatura).
- **Visão de Fatura:** Ao clicar em um cartão, o usuário verá a fatura atual em aberto, com todas as transações listadas. Haverá também um histórico de faturas passadas.
- **Modal de Pagamento:** Um botão "Pagar Fatura" abrirá um modal onde o usuário seleciona a conta de origem do pagamento e o valor a ser pago (total ou parcial), acionando a `CreateTransferAction`.
