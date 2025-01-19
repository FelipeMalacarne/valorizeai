import { Config } from 'ziggy-js';

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


export type PaginatedResource<T> = {
    data: T[]
    meta: {
        total: number
        page: number
        last_page: number
        from: number
        to: number
        links: LinkType[]
    }
    links: {
        first: string
        last: string
        prev: string | null
        next: string | null
    }
}

export type Account = {
    id: string
    name: string
    balance: number
    type: string
    number: string
    description: string
    color: string
    created_at: string
    updated_at: string
}
