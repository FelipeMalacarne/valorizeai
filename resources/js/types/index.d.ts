import { Config } from "ziggy-js";

export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
    ziggy: Config & { location: string };
};

export interface ErrorResponse {
    message: string;
    errors: Errors;
}

export type Errors = Record<string, string[]>;

export type LinkType = {
    url: string | null;
    label: string;
    active: boolean;
};

export type PaginatedResource<T> = {
    data: T[];
    meta: {
        total: number;
        page: number;
        last_page: number;
        from: number;
        to: number;
        links: LinkType[];
    };
    links: {
        first: string;
        last: string;
        prev: string | null;
        next: string | null;
    };
};

export enum AccountType {
    Checking = "checking",
    Savings = "savings",
    Salary = "salary",
}

export enum Color {
    Lavender = "lavender",
    Blue = "blue",
    Green = "green",
    Yellow = "yellow",
    Red = "red",
    Rosewater = "rosewater",
    Flamingo = "flamingo",
    Pink = "pink",
    Mauve = "mauve",
    Maroon = "maroon",
    Peach = "peach",
    Teal = "teal",
    Sky = "sky",
    Sapphire = "sapphire",
}

export type Account = {
    id: string;
    name: string;
    balance: number;
    type: AccountType;
    bank_code: string;
    number: string;
    description: string;
    color: string;
    created_at: string;
    updated_at: string;
};

export type Category = {
    id: string;
    name: string;
    color: Color;
};

export type Transaction = {
    id: string;
    amount: number;
    fitid: string;
    memo: string;
    currency: string;
    account: string;
    categories: Category[];
    description: string;
    date_posted: string;
};
