---
title: "ValorizeAI - Database Schema"
author: "Felipe Malacarne"
date: "12/03/2025"
tags:  [Database, Schema,  Projeto]
---
---
# Database Schema - ValorizeAI

Este documento apresenta o esquema do banco de dados, incluindo as tabelas existentes e as novas, com índices conforme definido.

```sql
// TABELAS EXISTENTES

Table users {
  id int [pk]
  name string
  email string
  email_verified_at timestamp
  password string
  created_at timestamp
  updated_at timestamp

  Indexes {
    (email) [name:"idx_users_email"]
  }
}

Table financial_groups {
  id int [pk]
  name string
  description string [null]
  created_at timestamp
  updated_at timestamp

  Indexes {
    (name) [name:"idx_financial_groups_name"]
  }
}

Table group_members {
  id int [pk]
  user_id int
  financial_group_id int
  role string
  permissions string [null]
  joined_at timestamp
  created_at timestamp
  updated_at timestamp

  Indexes {
    (user_id, financial_group_id) [name:"uk_group_members_user_financial", unique]
  }
}

Table accounts {
  id int [pk]
  name string
  balance int
  number string [null]
  color string
  description string [null]
  type string
  bank_id string(3) [null]
  user_id int [null]
  financial_group_id int [null]
  created_at timestamp
  updated_at timestamp

  Indexes {
    (user_id) [name:"idx_accounts_user_id"]
    (financial_group_id) [name:"idx_accounts_financial_group_id"]
    (type) [name:"idx_accounts_type"]
  }
}

Table transactions {
  id int [pk]
  fitid string [null]
  amount int
  memo string [null]
  currency string(3)
  posted_at timestamp
  account_id int
  created_at timestamp
  updated_at timestamp
  card_statement_id int [null]
  import_file_id int [null]
  ext_id string [null]

  Indexes {
    (account_id) [name:"idx_transactions_account_id"]
    (posted_at) [name:"idx_transactions_posted_at"]
    (ext_id) [name:"idx_transactions_ext_id"]
  }
}

Table budgets {
  id int [pk]
  name string
  budgeted_amount decimal(10, 2)
  spent_amount decimal(10, 2) [default: 0.00]
  start_date date
  end_date date
  category_id int
  user_id int [null]
  financial_group_id int [null]
  recurrence_type varchar(20) [default: 'one-time']
  created_at timestamp
  updated_at timestamp

  Indexes {
    (category_id) [name:"idx_budgets_category_id"]
    (user_id) [name:"idx_budgets_user_id"]
    (financial_group_id) [name:"idx_budgets_financial_group_id"]
  }
}
ref: budgets.category_id > categories.id

Table categories {
  id int [pk]
  name string
  description string [null]
  user_id int [null]
  financial_group_id int [null]
  is_default boolean [default: false]
  created_at timestamp
  updated_at timestamp

  Indexes {
    (name, user_id, financial_group_id) [name:"uk_categories_unique", unique]
    (user_id) [name:"idx_categories_user_id"]
    (financial_group_id) [name:"idx_categories_financial_group_id"]
  }
}
ref: categories.user_id > users.id
ref: categories.financial_group_id > financial_groups.id

Table category_transaction {
  transaction_id string
  category_id string
  created_at timestamp
  updated_at timestamp

  Indexes {
    (transaction_id, category_id) [name:"uk_category_transaction", unique]
  }
}
ref: category_transaction.category_id > categories.id
ref: category_transaction.transaction_id > transactions.id

Table credit_cards {
  id int [pk]
  account_id int
  credit_limit int
  available_credit int
  apr decimal
  payment_due_date date
  minimum_payment_due int
  created_at timestamp
  updated_at timestamp

  Indexes {
    (account_id) [name:"idx_credit_cards_account_id"]
  }
}
Ref: credit_cards.account_id > accounts.id

ref: group_members.user_id > users.id
ref: group_members.financial_group_id > financial_groups.id
ref: accounts.user_id > users.id
ref: accounts.financial_group_id > financial_groups.id
ref: transactions.account_id > accounts.id
ref: budgets.user_id > users.id
ref: budgets.financial_group_id > financial_groups.id

// TABELAS NOVAS

Table investment_categories {
  id int [pk]
  name string
  description string [null]
  created_at timestamp
  updated_at timestamp

  Indexes {
    (name) [name:"idx_investment_categories_name"]
  }
}

Table assets {
  id int [pk]
  investment_category_id int
  ticker string
  name string
  currency string(3) [default: 'BRL']
  description string [null]
  created_at timestamp
  updated_at timestamp

  Indexes {
    (investment_category_id) [name:"idx_assets_investment_category_id"]
    (ticker) [name:"uk_assets_ticker", unique]
  }
}
ref: assets.investment_category_id > investment_categories.id

Table price_history {
  id int [pk]
  asset_id int
  price decimal(10, 4)
  recorded_at timestamp
  created_at timestamp
  updated_at timestamp

  Indexes {
    (asset_id, recorded_at) [name:"idx_price_history_asset_recorded"]
  }
}
ref: price_history.asset_id > assets.id

Table investment_transactions {
  id int [pk]
  user_id int
  asset_id int
  quantity decimal(18, 8)
  unit_price decimal(10, 4)
  transaction_type string
  transaction_date timestamp
  created_at timestamp
  updated_at timestamp

  Indexes {
    (user_id) [name:"idx_investment_transactions_user_id"]
    (asset_id) [name:"idx_investment_transactions_asset_id"]
    (transaction_date) [name:"idx_investment_transactions_date"]
  }
}
ref: investment_transactions.asset_id > assets.id
ref: investment_transactions.user_id > users.id

Table investment_positions {
  id int [pk]
  user_id int
  asset_id int
  quantity decimal(18, 8)
  average_cost decimal(10, 4)
  created_at timestamp
  updated_at timestamp

  Indexes {
    (user_id, asset_id) [name:"idx_investment_positions_user_asset"]
  }
}
ref: investment_positions.asset_id > assets.id
ref: investment_positions.user_id > users.id

Table balance_snapshots {
  id int [pk]
  user_id int
  snapshot_date date
  total_balance decimal(10, 2)
  created_at timestamp
  updated_at timestamp

  Indexes {
    (user_id, snapshot_date) [name:"idx_balance_snapshots_user_date"]
  }
}
ref: balance_snapshots.user_id > users.id

Table credit_card_statements {
  id int [pk]
  credit_card_id int
  start_date date
  end_date date
  due_date date
  total_amount decimal(10, 2) [default: 0.00]
  is_paid boolean [default: false]
  paid_at timestamp [null]
  created_at timestamp
  updated_at timestamp

  Indexes {
    (credit_card_id, start_date, end_date) [name:"idx_cc_statements_card_start_end"]
  }
}
ref: credit_card_statements.credit_card_id > credit_cards.id

Table credit_card_payments {
  id int [pk]
  card_statement_id int
  paid_amount decimal(10, 2)
  paid_on timestamp
  created_at timestamp
  updated_at timestamp

  Indexes {
    (card_statement_id, paid_on) [name:"idx_cc_payments_statement_paidon"]
  }
}
ref: credit_card_payments.card_statement_id > credit_card_statements.id

Table plans {
  id int [pk]
  name string
  price decimal(10, 2)
  periodicity string
  is_active boolean [default: true]
  max_accounts int [null]
  max_users_in_group int [null]
  created_at timestamp
  updated_at timestamp

  Indexes {
    (is_active, name) [name:"idx_plans_active_name"]
  }
}

Table subscriptions {
  id int [pk]
  user_id int
  plan_id int
  started_at timestamp
  ended_at timestamp [null]
  canceled_at timestamp [null]
  is_active boolean [default: true]
  created_at timestamp
  updated_at timestamp

  Indexes {
    (user_id, is_active) [name:"idx_subscriptions_user_active"]
  }
}
ref: subscriptions.user_id > users.id
ref: subscriptions.plan_id > plans.id

Table subscription_payments {
  id int [pk]
  subscription_id int
  amount decimal(10, 2)
  payment_method string
  status string
  stripe_invoice_id string [null]
  created_at timestamp
  updated_at timestamp

  Indexes {
    (subscription_id, status) [name:"idx_subscription_payments_sub_status"]
  }
}
ref: subscription_payments.subscription_id > subscriptions.id

Table import_files {
  id int [pk]
  user_id int
  file_name string
  file_type string
  account_id int [null]
  created_at timestamp
  updated_at timestamp

  Indexes {
    (user_id, file_type) [name:"idx_import_files_user_type"]
  }
}
ref: import_files.user_id > users.id
ref: import_files.account_id > accounts.id
ref: transactions.import_file_id > import_files.id

Table notification_types {
  id int [pk]
  name string
  created_at timestamp
  updated_at timestamp

  Indexes {
    (name) [name:"idx_notification_types_name"]
  }
}

Table notifications {
  id int [pk]
  user_id int
  notification_type_id int
  title string [null]
  message text
  is_read boolean [default: false]
  created_at timestamp
  updated_at timestamp

  Indexes {
    (user_id, is_read) [name:"idx_notifications_user_isread"]
  }
}
ref: notifications.user_id > users.id
ref: notifications.notification_type_id > notification_types.id

Table financial_forecasts {
  id int [pk]
  user_id int
  forecast_type string
  target_date date
  predicted_value decimal(10, 2)
  confidence decimal(5, 2) [null]
  created_at timestamp
  updated_at timestamp

  Indexes {
    (user_id, forecast_type, target_date) [name:"idx_financial_forecasts_user_type_date"]
  }
}
ref: financial_forecasts.user_id > users.id
```

[Next: [[Overview]] | [[Architecture]] ]