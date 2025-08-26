# Arquitetura e Design do Sistema

## 1. Introdução

O objetivo deste documento é descrever a arquitetura e o design do sistema para o aplicativo de gestão financeira "ValorizeAI". A plataforma permitirá aos usuários gerenciar suas finanças de forma abrangente, incluindo contas bancárias, orçamentos, cartões de crédito e investimentos.

## 2. Princípios de Design

A aplicação seguirá os seguintes princípios e padrões para garantir um código limpo, manutenível e escalável:

- **Arquitetura Limpa (Clean Architecture):** Separaremos as preocupações em camadas distintas: Domínio, Aplicação e Infraestrutura.
- **Domain-Driven Design (DDD):** Modelaremos o software em torno do domínio de negócio, utilizando Value Objects (como `Money`) e entidades ricas.
- **Action-Query-DTO Pattern:** Conforme definido no `GEMINI.md`, usaremos Actions, Queries e DTOs para estruturar a lógica de negócio e o fluxo de dados.
- **API-First:** O backend será uma API robusta que servirá o frontend e potenciais clientes futuros.
- **Jobs em Background:** Para tarefas de longa duração, como o processamento de arquivos de extrato, usaremos a infraestrutura de Jobs e Queues do Laravel para garantir uma experiência de usuário não bloqueante.
- **Segurança e Integridade:** Utilizaremos tabelas de *staging* (preparação), como a `import_transactions`, para validar e confirmar dados importados antes de persistí-los nas tabelas principais.

## 3. Arquitetura de Alto Nível

O sistema é composto pelos seguintes componentes:

- **Frontend:** Uma Single Page Application (SPA) desenvolvida com **React**, **TypeScript** e **Vite**. A interface será reativa e moderna, consumindo os dados da API do backend.
- **Backend:** Uma API construída com **Laravel 11** e **PHP 8.3**, seguindo os padrões de design mencionados.
- **Banco de Dados:** Um banco de dados **PostgreSQL**, escolhido por sua robustez e suporte a tipos de dados avançados como `jsonb`.
- **Comunicação em Tempo Real:** Para notificações e atualizações de UI em tempo real, utilizaremos **Laravel Reverb**, que fornece uma solução de WebSockets ultrarrápida e escalável, com um servidor próprio e integração nativa com o sistema de Broadcasting do Laravel.

## 4. Funcionalidades em Tempo Real (WebSockets com Reverb)

A principal aplicação para o Reverb será no processo de conciliação bancária:

1.  O usuário faz o upload de um extrato.
2.  A `CreateImportAction` dispara o `ProcessBankStatementFileJob`.
3.  O Job, enquanto processa o arquivo, dispara eventos (ex: `TransactionProcessed`, `ImportAnalysisCompleted`).
4.  O Reverb transmite esses eventos para o frontend.
5.  O frontend reage a esses eventos, mostrando uma barra de progresso, atualizando o status da importação e notificando o usuário quando a revisão estiver pronta, tudo isso sem a necessidade de recarregar a página.

## 5. Módulos Principais

A aplicação será dividida nos seguintes módulos principais:

1.  **Core:** Funcionalidades centrais, incluindo gestão de `Usuários`, `Contas` e `Transações`.
2.  **Conciliação Bancária:** Funcionalidades para importar extratos (OFX, CSV) e conciliar transações, utilizando um sistema de *staging* com as tabelas `imports` e `import_transactions`.
3.  **Orçamentos (Budgets):** Sistema de orçamentos inspirado no método de "envelopes" (buckets) do YNAB, baseado nas tabelas `budgets` e `budget_allocations`.
4.  **Gestão de Cartões de Crédito:** Gerenciamento de faturas, limites e pagamentos, utilizando contas do tipo `credit` e a tabela `credit_card_statements`.
5.  **Gestão de Investimentos:** Rastreamento de ativos (`securities`) e `investment_transactions`, com integração a APIs de mercado para atualização de valores.

## 6. Estrutura da Documentação

Esta documentação será organizada da seguinte forma na pasta `docs/`:

- `system-design.md`: Este arquivo, com a visão geral da arquitetura.
- `database-schema.md`: Documentação detalhada do schema do banco de dados.
- `features/`: Uma pasta contendo um arquivo para cada um dos módulos principais, detalhando suas regras de negócio e implementação.
