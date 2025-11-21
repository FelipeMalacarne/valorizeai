import { NavFooter } from '@/components/nav-footer';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, DollarSign, Folder, Home, Inbox, Key, Landmark, PiggyBank, Tags, Webhook } from 'lucide-react';
import AppLogo from './app-logo';
import { NavList } from './nav-list';

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: '#',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: '#',
        icon: BookOpen,
    },
];

const platformNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: route('dashboard', undefined, false),
        icon: Home,
    },
    {
        title: 'Contas Bancárias',
        href: route('accounts.index', undefined, false),
        icon: Landmark,
    },
    {
        title: 'Transações',
        href: route('transactions.index', undefined, false),
        icon: DollarSign,
    },
    {
        title: 'Importações',
        href: route('imports.index', undefined, false),
        icon: Inbox,
    },
    {
        title: 'Orçamentos',
        href: route('budgets.index', undefined, false),
        icon: PiggyBank,
    },
    {
        title: 'Categorias',
        href: route('categories.index', undefined, false),
        icon: Tags,
    },
    // {
    //     title: 'Transações',
    //     href: route('transactions.index', undefined, false),
    //     icon: DollarSign,
    // },
];

const developerNavItems: NavItem[] = [
    {
        title: 'Tokens',
        href: route('tokens.index', undefined, false),
        icon: Key,
    },
    // {
    //     title: 'Webhooks',
    //     href: route('webhooks.index', undefined, false),
    //     icon: Webhook,
    // }
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>

                {/* <TeamSwitcher teams={data.teams} /> */}
            </SidebarHeader>

            <SidebarContent>
                <NavList label="Financeiro" items={platformNavItems} />
                <NavList label="Desenvolvedor" items={developerNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
