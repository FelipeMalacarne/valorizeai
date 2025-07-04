import { NavFooter } from '@/components/nav-footer';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, DollarSign, Folder, Home, Landmark } from 'lucide-react';
import AppLogo from './app-logo';
import { NavList } from './nav-list';

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits',
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
