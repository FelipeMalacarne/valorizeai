import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export type SharedData<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    flash: {
        success: string | null;
        error: string | null;
    };
    notifications?: {
        items: App.Http.Resources.NotificationResource[];
        unread_count: number;
    } | null;
    [key: string]: unknown;
};


export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export type LinkType = {
    url: string | null;
    label: string;
    active: boolean;
};

export type PaginatedResource<T> = {
    data: T[];
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    total: number;
    page: number;
    to: number;
    links: LinkType[];
    path: string;
    first_page_url: string;
    last_page_url: string;
    prev_page_url: string;
    next_page_url: string;
};
