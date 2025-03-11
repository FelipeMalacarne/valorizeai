declare namespace App.Domain.Account.Enums {
    export type Color =
        | "lavender"
        | "blue"
        | "green"
        | "yellow"
        | "red"
        | "rosewater"
        | "flamingo"
        | "pink"
        | "mauve"
        | "maroon"
        | "peach"
        | "teal"
        | "sky"
        | "sapphire";
    export type Type = "checking" | "savings" | "salary";
}
declare namespace App.Domain.Transaction.Queries {
    export type IndexTransactionsQuery = {
        user_id?: string;
        search: string | null;
        categories: Array<string> | null;
        accounts: Array<string> | null;
        start_date: string | null;
        end_date: string | null;
        order_by: App.Support.Data.OrderBy | null;
        page: number;
        per_page: number;
    };
}
declare namespace App.Support.Data {
    export type OrderBy = {
        column: string;
        direction: App.Support.Enums.OrderByDirection;
    };
}
declare namespace App.Support.Enums {
    export type OrderByDirection = "asc" | "desc";
}
declare namespace App.Support.Explorer.Enums {
    export type MultiMatchType =
        | "best_fields"
        | "most_fields"
        | "cross_fields"
        | "phrase"
        | "phrase_prefix"
        | "bool_prefix";
}
