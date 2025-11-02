# Funcionalidade: Orçamento no Estilo YNAB (You Need A Budget)

## 1. Visão Geral

Esta funcionalidade implementa o método de orçamento de "envelopes" (ou "buckets"), popularizado pelo YNAB. O princípio fundamental é "dar um trabalho para cada real" (Give Every Dollar a Job). Os usuários alocam sua renda em categorias de despesas, e o sistema rastreia os gastos em relação a essas alocações em tempo real.

## 2. Histórias de Usuário

- **Como usuário,** eu quero poder criar um orçamento para cada uma das minhas categorias de despesa para um mês específico.
- **Como usuário,** ao registrar uma nova transação, eu quero que o valor gasto seja automaticamente deduzido do orçamento da categoria correspondente naquele mês.
- **Como usuário,** eu quero ter uma visão clara do meu orçamento mensal, mostrando o valor orçado, o gasto e o saldo restante para cada categoria.
- **Como usuário,** eu quero poder mover dinheiro entre as categorias de orçamento facilmente, caso minhas prioridades de gastos mudem ao longo do mês.
- **Como usuário,** eu quero que o saldo restante de uma categoria no final do mês (positivo ou negativo) seja transportado para o mês seguinte, influenciando o valor disponível naquela categoria.

## 3. Modelo de Dados

Para implementar esta funcionalidade, utilizamos as tabelas `budgets` e `budget_allocations`.

- **`budgets`**: Esta tabela representa o "envelope" em si. Ela cria um link permanente entre um `user` e uma `category`, estabelecendo que o usuário deseja orçar para aquela categoria.
- **`budget_allocations`**: Esta tabela armazena o valor específico que o usuário decide alocar para um determinado `budget` em um mês específico. Cada linha representa o valor orçado para uma categoria em um mês.

> Observação: o envelope guarda a moeda (`currency`) do usuário no momento da criação para garantir consistência na exibição dos valores.

## 4. Lógica do Backend

- **Cálculo em Tempo Real:** Para evitar problemas de sincronização, os valores de "Gasto" e "Restante" não serão armazenados no banco de dados. Eles serão sempre calculados em tempo real.

- **Queries:**
    - `BudgetOverviewQuery`: Esta será a query principal da funcionalidade. Para um dado usuário e mês, ela irá:
        1. Buscar todas as `budget_allocations` do mês.
        2. Para cada alocação, buscar o `budget` e a `category` associados.
        3. Calcular o total de gastos (`spent`) para cada categoria no mês, somando as `transactions` correspondentes.
        4. Calcular o saldo do mês anterior (`rollover`) para cada categoria.
        5. Retornar um DTO (`BudgetData`) com os campos: `category_name`, `budgeted_amount`, `spent_amount`, e `remaining_amount` (calculado como `rollover` + `budgeted_amount` - `spent_amount`).

- **Actions:**
    - `AllocateMoneyToAction`: Cria ou atualiza uma entrada em `budget_allocations` para um `budget` em um mês específico.
    - `MoveMoneyBetweenBudgetsAction`: Uma única ação transacional que subtrai um valor da `budgeted_amount` de uma `budget_allocations` e o adiciona a outra no mesmo mês.

- **Controller & Rotas:**
    - `BudgetController@index` renderiza a tela `/budgets`, recebendo os dados agregados através da `BudgetOverviewQuery`.
    - `BudgetController@store|update|destroy` mantém o cadastro dos envelopes.
    - `BudgetController@allocate` e `BudgetController@move` expõem as ações de alocação e movimentação via rotas `POST /budgets/allocate` e `POST /budgets/move`.

## 5. Implementação no Frontend

- **Página de Orçamento (`/budgets`):**
    - **Seletor de Mês:** Um seletor no cabeçalho permitirá ao usuário navegar entre os meses.
    - **Tabela de Orçamento:** A interface principal será uma tabela com as seguintes colunas:
        - **Categoria:** O nome da categoria do orçamento.
        - **Orçado:** Um campo de input onde o usuário define o `budgeted_amount` para o mês, persistindo via `POST /budgets/allocate`.
        - **Gastos:** O valor total gasto na categoria, calculado pela query.
        - **Restante:** O saldo final (`Orçado - Gastos`). A célula será visualmente destacada (ex: verde para positivo, vermelho para negativo).
    - **Funcionalidade de Mover Dinheiro:** Uma interface (talvez um modal) que permitirá ao usuário selecionar a categoria de origem, a de destino e o valor a ser movido.
