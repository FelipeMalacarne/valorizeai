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
    export type RegisterUserRequest = {
        name: string;
        email: string;
        password: string;
        preferred_currency: App.Enums.Currency;
    };
}
