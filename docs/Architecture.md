---
title: "ValorizeAI - Arquitetura & Estrutura do Projeto"
author: "Felipe Malacarne"
date: "12/03/2025"
tags: [Architecture, Laravel, DDD]
---
# Arquitetura & Estrutura do Projeto

Este documento descreve a estrutura da aplicação seguindo os princípios do Domain-Driven Design (DDD), separando as camadas em Domain, Application, Interface Adapters e Infrastructure.

## Estrutura de Pastas Sugerida

```plaintext
app/
├── Domain/
│   ├── Identity/
│   │   ├── Models/
│   │   │   ├── User.php
│   │   │   ├── FinancialGroup.php
│   │   │   └── GroupMember.php
│   │   ├── Repositories/
│   │   │   └── UserRepositoryInterface.php
│   │   └── Services/
│   │       └── IdentityService.php
│   │
│   ├── Account/
│   │   ├── Models/
│   │   │   └── Account.php
│   │   ├── ValueObjects/
│   │   │   └── AccountNumber.php
│   │   ├── Repositories/
│   │   │   └── AccountRepositoryInterface.php
│   │   └── Services/
│   │       └── AccountService.php
│   │
│   ├── Transaction/
│   │   ├── Models/
│   │   │   └── Transaction.php
│   │   ├── Repositories/
│   │   │   └── TransactionRepositoryInterface.php
│   │   └── Services/
│   │       └── TransactionService.php
│   │
│   ├── Category/
│   │   ├── Models/
│   │   │   └── Category.php
│   │   ├── Repositories/
│   │   │   └── CategoryRepositoryInterface.php
│   │   └── Services/
│   │       └── CategoryService.php
│   │
│   ├── Investment/
│   │   ├── Models/
│   │   │   ├── InvestmentCategory.php
│   │   │   ├── Asset.php
│   │   │   ├── PriceHistory.php
│   │   │   ├── InvestmentTransaction.php
│   │   │   └── InvestmentPosition.php
│   │   ├── Repositories/
│   │   │   └── InvestmentRepositoryInterface.php
│   │   └── Services/
│   │       └── InvestmentService.php
│   │
│   ├── CreditCard/
│   │   ├── Models/
│   │   │   ├── CreditCard.php
│   │   │   ├── CreditCardStatement.php
│   │   │   └── CreditCardPayment.php
│   │   ├── Repositories/
│   │   │   └── CreditCardRepositoryInterface.php
│   │   └── Services/
│   │       └── CreditCardService.php
│   │
│   ├── Subscription/
│   │   ├── Models/
│   │   │   ├── Plan.php
│   │   │   ├── Subscription.php
│   │   │   └── SubscriptionPayment.php
│   │   ├── Repositories/
│   │   │   └── SubscriptionRepositoryInterface.php
│   │   └── Services/
│   │       └── SubscriptionService.php
│   │
│   ├── Import/
│   │   ├── Models/
│   │   │   └── ImportFile.php
│   │   ├── Repositories/
│   │   │   └── ImportRepositoryInterface.php
│   │   └── Services/
│   │       └── ImportService.php
│   │
│   ├── Notification/
│   │   ├── Models/
│   │   │   ├── NotificationType.php
│   │   │   └── Notification.php
│   │   ├── Repositories/
│   │   │   └── NotificationRepositoryInterface.php
│   │   └── Services/
│   │       └── NotificationService.php
│   │
│   └── Forecast/
│       ├── Models/
│       │   └── FinancialForecast.php
│       ├── Repositories/
│       │   └── ForecastRepositoryInterface.php
│       └── Services/
│           └── ForecastService.php
│
├── Application/
│   ├── Commands/
│   │   ├── CreateTransactionCommand.php
│   │   └── ... (outros comandos)
│   ├── CommandHandlers/
│   │   └── CreateTransactionHandler.php
│   ├── Queries/
│   │   ├── GetAccountBalanceQuery.php
│   │   └── ... (outras queries)
│   ├── QueryHandlers/
│   │   └── GetAccountBalanceHandler.php
│   └── Messaging/
│       └── Contracts/
│           ├── Command.php
│           ├── CommandHandlerInterface.php
│           ├── CommandBusInterface.php
│           ├── Query.php
│           ├── QueryHandlerInterface.php
│           └── QueryBusInterface.php
│
├── InterfaceAdapters/   <!-- Também chamado de "Presentation Adapters" -->
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Api/
│   │   │   │   └── AccountController.php
│   │   │   └── GraphQL/
│   │   │       └── AccountGraphQLController.php
│   │   └── Requests/
│   │       └── CreateTransactionRequest.php
│   └── Console/
│       └── Commands/
│           └── ImportTransactionsCommand.php
│
└── Infrastructure/
    ├── Persistence/
    │   ├── Eloquent/
    │   │   ├── UserRepository.php
    │   │   ├── AccountRepository.php
    │   │   └── ... (outros repositórios)
    │   └── EventStore/
    │       └── EventStoreService.php
    ├── Services/
    │   └── StripeService.php
    └── Providers/
        └── DomainServiceProvider.php
```
## Observações

- **Interface Adapters:**  
    São responsáveis por adaptar requisições externas (HTTP, GraphQL, CLI) para os comandos e queries da camada de Application.
    
- **Domain & Application:**  
    Toda a lógica de negócio fica no domínio, enquanto a orquestração de casos de uso (comandos, queries) fica na camada de Application.
    
- **Infrastructure:**  
    Implementa detalhes técnicos como persistência, integração com serviços externos (ex.: Stripe) e gerenciamento de eventos.
    

[Next: [[Overview]] | [[Domain]] | [[DatabaseSchema]] ]
