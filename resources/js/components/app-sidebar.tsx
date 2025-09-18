import { NavFooter } from '@/components/nav-footer';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, DollarSign, Folder, Home, Landmark } from 'lucide-react';
import AppLogo from './app-logo';
import { NavList } from './nav-list';
import { index as transactionsIndex } from '@/routes/transactions';
import { index as accountsIndex } from '@/routes/accounts';
import { dashboard } from '@/routes';

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
        href: dashboard().url,
        icon: Home,
    },
    {
        title: 'Contas Bancárias',
        href: accountsIndex().url,
        icon: Landmark,
    },
    {
        title: 'Transações',
        href: transactionsIndex().url,
        icon: DollarSign,
    },
    // {
    //     title: 'Transações',
    //     href: route('transactions.index', undefined, false),
    //     icon: DollarSign,
    // },
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
                <NavList label="Plataforma" items={platformNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
