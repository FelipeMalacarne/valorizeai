declare namespace App.Data {
    export type OrderBy = {
        column: string;
        direction: App.Enums.OrderByDirection;
    };
}
declare namespace App.Enums {
    export type AccountType = 'checking' | 'savings' | 'investment' | 'credit';
    export type Color =
        | 'lavender'
        | 'blue'
        | 'green'
        | 'yellow'
        | 'red'
        | 'rosewater'
        | 'flamingo'
        | 'pink'
        | 'mauve'
        | 'maroon'
        | 'peach'
        | 'teal'
        | 'sky'
        | 'sapphire';
    export type Currency = 'BRL' | 'USD' | 'EUR';
    export type ImportExtension = 'ofx' | 'csv';
    export type ImportStatus = 'processing' | 'pending_review' | 'approved' | 'refused' | 'completed' | 'failed';
    export type ImportTransactionStatus = 'pending' | 'matched' | 'conflicted' | 'refused' | 'new' | 'approved' | 'rejected';
    export type OrderByDirection = 'asc' | 'desc';
    export type OrganizationRole = 'owner' | 'admin' | 'member';
    export type TransactionType = 'debit' | 'credit';
}
declare namespace App.Http.Requests {
    export type RegisterUserRequest = {
        name: string;
        email: string;
        password: string;
        password_confirmation: string;
        preferred_currency: App.Enums.Currency;
    };
}
declare namespace App.Http.Requests.Account {
    export type IndexAccountsRequest = {
        search: string | null;
        type: App.Enums.AccountType | null;
        currency: App.Enums.Currency | null;
    };
    export type StoreAccountRequest = {
        name: string;
        number: string | null;
        currency: App.Enums.Currency;
        type: App.Enums.AccountType;
        bank_id: string;
    };
    export type UpdateAccountRequest = {
        name: string;
        number: string | null;
        currency: App.Enums.Currency;
        type: App.Enums.AccountType;
        bank_id: string;
    };
}
declare namespace App.Http.Requests.Budget {
    export type AllocateBudgetRequest = {
        budget_id: string;
        month: string;
        amount: App.ValueObjects.Money;
    };
    export type IndexBudgetRequest = {
        month: string | null;
    };
    export type MoveBudgetAllocationRequest = {
        from_budget_id: string;
        to_budget_id: string;
        month: string;
        amount: App.ValueObjects.Money;
    };
    export type StoreBudgetRequest = {
        category_id: string;
        name: string | null;
    };
    export type UpdateBudgetRequest = {
        name: string;
    };
}
declare namespace App.Http.Requests.Category {
    export type CreateCategoryRequest = {
        name: string;
        color: App.Enums.Color;
        description: string | null;
        is_default: boolean;
    };
    export type ListCategoriesRequest = {
        search: string | null;
        is_default: boolean | null;
        per_page: number;
        page: number;
    };
    export type UpdateCategoryRequest = {
        name: string;
        color: App.Enums.Color;
        description: string | null;
        is_default: boolean;
    };
}
declare namespace App.Http.Requests.Import {
    export type ImportRequest = {
        files: Array<any>;
        account_id: string | null;
    };
}
declare namespace App.Http.Requests.Transaction {
    export type IndexTransactionRequest = {
        search: string | null;
        categories: Array<string>;
        accounts: Array<string>;
        start_date: string | null;
        end_date: string | null;
        order_by: App.Data.OrderBy | null;
        type: App.Enums.TransactionType | null;
        page: number;
        per_page: number;
    };
    export type StoreTransactionRequest = {
        account_id: string;
        category_id: string | null;
        amount: App.ValueObjects.Money;
        date: string;
        memo: string | null;
    };
    export type UpdateTransactionRequest = {
        amount: App.ValueObjects.Money;
        date: string;
        memo: string | null;
        category_id: string | null;
    };
}
declare namespace App.Http.Resources {
    export type AccountResource = {
        id: string;
        name: string;
        number: string | null;
        balance: App.ValueObjects.Money;
        currency: App.Enums.Currency;
        type: App.Enums.AccountType;
        bank: App.Http.Resources.BankResource;
    };
    export type BankResource = {
        id: string;
        code: string;
        name: string;
    };
    export type BudgetOverviewResource = {
        id: string;
        currency: App.Enums.Currency;
        category: App.Http.Resources.CategoryResource;
        budgeted_amount: App.ValueObjects.Money;
        spent_amount: App.ValueObjects.Money;
        rollover_amount: App.ValueObjects.Money;
        remaining_amount: App.ValueObjects.Money;
    };
    export type BudgetResource = {
        id: string;
        name: string;
        currency: App.Enums.Currency;
        category: App.Http.Resources.CategoryResource;
    };
    export type CategoryResource = {
        id: string;
        name: string;
        color: App.Enums.Color;
        description: string | null;
        is_default: boolean;
    };
    export type TransactionResource = {
        amount_formatted: string;
        id: string;
        amount: App.ValueObjects.Money;
        fitid: string | null;
        memo: string | null;
        type: App.Enums.TransactionType;
        date: string;
        category: App.Http.Resources.CategoryResource | null;
        account: App.Http.Resources.AccountResource;
        splits: Array<App.Http.Resources.TransactionSplitResource>;
    };
    export type TransactionSplitResource = {
        amount_formatted: string;
        id: string;
        amount: App.ValueObjects.Money;
        memo: string | null;
        category: App.Http.Resources.CategoryResource;
    };
    export type TransactionSummaryResource = {
        balance: App.ValueObjects.Money;
        credits: App.ValueObjects.Money;
        debits: App.ValueObjects.Money;
    };
}
declare namespace App.ValueObjects {
    export type Money = {
        formatted: string;
        value: number;
        currency: App.Enums.Currency;
    };
}
