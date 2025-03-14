---
title: "ValorizeAI - Domain & DDD"
author: "Felipe Malacarne"
date: "12/03/2025"
tags: [DDD, Domain, Projeto]
---

# Domain & DDD - ValorizeAI

Este documento descreve os principais domínios e bounded contexts do sistema, de acordo com os princípios do Domain-Driven Design (DDD).

## Bounded Contexts

- **Identity Context**  
  Contém as entidades relacionadas à identificação e gerenciamento de usuários e grupos.  
  **Entidades:**  
  - **User**  
  - **FinancialGroup** (parte do Identity)  
  - **GroupMember**

- **Core Finance Context**  
  Abrange as operações centrais de finanças.  
  **Entidades:**  
  - **Account**  
  - **Transaction**  
  - **Budget**  
  - **Category**

- **Investments Context**  
  Gerencia os investimentos dos usuários, desde a definição de categorias até o histórico de preços.  
  **Entidades:**  
  - **InvestmentCategory**  
  - **Asset**  
  - **PriceHistory**  
  - **InvestmentTransaction**  
  - **InvestmentPosition**

- **Credit Card Context**  
  Focado no gerenciamento de cartões de crédito, faturas e pagamentos.  
  **Entidades:**  
  - **CreditCard**  
  - **CreditCardStatement**  
  - **CreditCardPayment**

- **Subscription & Billing Context**  
  Responsável por gerenciar os planos de assinatura e pagamentos via Stripe.  
  **Entidades:**  
  - **Plan**  
  - **Subscription**  
  - **SubscriptionPayment**

- **Import Context**  
  Trata da importação de dados financeiros de arquivos externos (OFX, CSV).  
  **Entidades:**  
  - **ImportFile**

- **Notification Context**  
  Gerencia o envio e registro de notificações aos usuários.  
  **Entidades:**  
  - **NotificationType**  
  - **Notification**

- **Forecasting Context**  
  Responsável por projeções financeiras e análises preditivas.  
  **Entidades:**  
  - **FinancialForecast**

## Diagrama Bounded Contexts (Mermaid)

```mermaid
flowchart TD
  %% Bounded Context: User Domain
  subgraph "User Domain"
    U[User Aggregate]
  end

  %% Bounded Context: Financial Management
  subgraph "Financial Management"
    ACC[Account Aggregate]
    BG[Budget Aggregate]
    CAT[Category Aggregate]
    TX[Transaction Aggregate]
    CTX[Category Transaction]
    CC[Credit Card Aggregate]
    CCS[Credit Card Statement]
    CCP[Credit Card Payment]
    IF[Import File Entity]
  end

  %% Bounded Context: Investment
  subgraph "Investment"
    IC[Investment Category]
    AS[Asset Aggregate]
    PH["Price History (VO)"]
    IT[Investment Transaction Aggregate]
    IP[Investment Position Aggregate]
    BS[Balance Snapshot Aggregate]
  end

  %% Bounded Context: Subscription & Billing
  subgraph "Subscription & Billing"
    PL[Plan Aggregate]
    SUB[Subscription Aggregate]
    SP[Subscription Payment Aggregate]
  end

  %% Bounded Context: Notification
  subgraph "Notification"
    NT[Notification Type]
    N[Notification Entity]
  end

  %% Bounded Context: Forecasting
  subgraph "Forecasting"
    FF[Financial Forecast Aggregate]
  end

  %% Relações de propriedade e interações
  U -- "Owns" --> ACC
  U -- "Owns" --> BG
  U -- "Owns" --> CAT
  
  ACC -- "Registers" --> TX
  TX -- "Classified via" --> CTX
  CTX -- "Links to" --> CAT
  TX -- "Imported by" --> IF
  
  ACC -- "Has" --> CC
  CC -- "Issues" --> CCS
  CCS -- "Paid via" --> CCP
  
  U -- "Executes" --> IT
  IT -- "Updates" --> IP
  IP -- "Consolidated in" --> BS
  AS -- "Categorized by" --> IC
  AS -- "Historical data in" --> PH
  
  U -- "Subscribes to" --> SUB
  SUB -- "Based on" --> PL
  SUB -- "Paid via" --> SP
  
  U -- "Receives" --> N
  N -- "Defined by" --> NT
  
  U -- "Generates" --> FF

```

[Next: [[DatabaseSchema]] |  | [[Architecture]] ]