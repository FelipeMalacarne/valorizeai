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
}
declare namespace App.Http.Requests {
    export type IndexAccountsRequest = {
        search: string | null;
    };
    export type RegisterUserRequest = {
        name: string;
        email: string;
        password: string;
        password_confirmation: string;
        preferred_currency: App.Enums.Currency;
    };
    export type StoreAccountRequest = {
        name: string;
        number: string | null;
        currency: App.Enums.Currency;
        type: App.Enums.AccountType;
        bank_id: string;
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
}
