# Funcionalidade: Gestão de Investimentos

## 1. Visão Geral

Esta funcionalidade permitirá aos usuários consolidar e rastrear a performance de suas carteiras de investimento. O sistema suportará diferentes tipos de ativos e transações, fornecendo uma visão unificada do patrimônio do usuário.

## 2. Histórias de Usuário

- **Como usuário,** eu quero poder adicionar minhas contas de investimento (ex: de corretoras) como um tipo específico de conta.
- **Como usuário,** eu quero poder registrar os diferentes ativos que possuo (Ações, FIIs, ETFs, etc.) em um catálogo.
- **Como usuário,** eu quero poder registrar minhas operações de investimento, como compras, vendas e recebimento de dividendos ou juros.
- **Como usuário,** eu quero ter um dashboard que mostre o valor atualizado da minha carteira, sua composição e a performance geral ao longo do tempo.

## 3. Modelo de Dados

- **`accounts`**: Contas com `type = 'investment'` representarão as contas de corretoras.
- **`securities`**: Funcionará como um catálogo de todos os ativos de investimento que os usuários da plataforma possuem. Isso evita a duplicação de informações sobre o mesmo ativo (ex: `PETR4`).
- **`investment_transactions`**: Armazena cada operação realizada em uma conta de investimento, como a compra de 100 ações de `PETR4` a um determinado preço.

## 4. Lógica do Backend

- **Integração com API de Dados de Mercado:** Para calcular o valor atual da carteira, o sistema precisará obter os preços de mercado dos ativos. Isso exigirá a integração com uma API externa de dados financeiros (ex: Alpha Vantage, Finnhub, ou uma API da B3 para ativos locais). Este é um ponto crítico da funcionalidade.

- **Actions:**
    - `AddSecurityAction`: Para adicionar um novo ativo ao catálogo `securities` (pode ser feito automaticamente na primeira vez que um usuário o adiciona).
    - `RecordInvestmentTransactionAction`: A ação principal, que irá:
        1. Criar uma nova entrada na tabela `investment_transactions`.
        2. **Criar uma transação financeira correspondente:** Uma operação de investimento impacta o caixa. Por exemplo, uma `buy` de R$ 5.000 em ações deve gerar uma `transaction` de débito de R$ 5.000 na conta corrente associada do usuário.
        3. O recebimento de um `dividend` deve gerar uma `transaction` de crédito na conta do usuário.

- **Queries:**
    - `PortfolioQuery`: Uma query complexa que será o motor do dashboard de investimentos. Ela irá:
        1. Buscar todas as `investment_transactions` do usuário para determinar a quantidade de cotas/ações de cada `security` que ele possui (sua posição).
        2. Chamar a API de dados de mercado para obter o preço atual de cada ativo.
        3. Calcular o valor de mercado atual de cada posição (`quantidade * preço_atual`).
        4. Calcular o custo médio de aquisição para cada ativo.
        5. Retornar um DTO (`PortfolioData`) com os dados consolidados para o frontend.

## 5. Implementação no Frontend

- **Dashboard de Investimentos (`/investments`):**
    - Gráficos mostrando a evolução do patrimônio e a alocação da carteira (ex: gráfico de pizza por tipo de ativo).
    - Um resumo com o valor total da carteira, o custo total e o lucro/prejuízo não realizado.
- **Página de Posição Detalhada:** Uma visão que lista todos os ativos da carteira, com detalhes para cada um: quantidade, preço médio, preço atual, valor de mercado, etc.
- **Formulários de Transação:** Modais intuitivos para o usuário registrar suas operações de compra, venda e recebimento de proventos.
