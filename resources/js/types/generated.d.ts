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
    export type Currency = 'BRL' | 'USD';
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
        name: string | null;
        number: string | null;
        type: App.Enums.AccountType | null;
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
declare namespace App.Http.Requests.Transaction {
    export type StoreTransactionRequest = {
        account_id: string;
        category_id: string | null;
        amount: App.ValueObjects.Money;
        type: App.Enums.TransactionType;
        date: string;
        memo: string | null;
    };
}
declare namespace App.Http.Resources {
    export type AccountResource = {
        id: string;
        name: string;
        number: string | null;
        currency: App.Enums.Currency;
        type: App.Enums.AccountType;
        bank: App.Http.Resources.BankResource;
    };
    export type BankResource = {
        id: string;
        code: string;
        name: string;
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
}
declare namespace App.ValueObjects {
    export type Money = {
        value: number;
        currency: App.Enums.Currency;
    };
}
