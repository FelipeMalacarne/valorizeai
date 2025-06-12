import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader, SidebarMenu, SidebarMenuButton } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import {
    AudioWaveform,
    BookOpen,
    Bot,
    Command,
    Folder,
    Frame,
    GalleryVerticalEnd,
    HomeIcon,
    PieChart,
    Settings2,
    SquareTerminal,
} from 'lucide-react';
import { TeamSwitcher } from './team-switcher';

// const mainNavItems: NavItem[] = [
//     {
//         title: 'Dashboard',
//         href: '/dashboard',
//         icon: LayoutGrid,
//     },
// ];

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

const data = {
    user: {
        name: 'shadcn',
        email: 'm@example.com',
        avatar: '/avatars/shadcn.jpg',
    },
    teams: [
        {
            name: 'Acme Inc',
            logo: GalleryVerticalEnd,
            plan: 'Enterprise',
        },
        {
            name: 'Acme Corp.',
            logo: AudioWaveform,
            plan: 'Startup',
        },
        {
            name: 'Evil Corp.',
            logo: Command,
            plan: 'Free',
        },
    ],
    navMain: [
        {
            title: 'Playground',
            url: '#',
            icon: SquareTerminal,
            isActive: true,
            items: [
                {
                    title: 'History',
                    url: '#',
                },
                {
                    title: 'Starred',
                    url: '#',
                },
                {
                    title: 'Settings',
                    url: '#',
                },
            ],
        },
        {
            title: 'Models',
            url: '#',
            icon: Bot,
            items: [
                {
                    title: 'Genesis',
                    url: '#',
                },
                {
                    title: 'Explorer',
                    url: '#',
                },
                {
                    title: 'Quantum',
                    url: '#',
                },
            ],
        },
        {
            title: 'Documentation',
            url: '#',
            icon: BookOpen,
            items: [
                {
                    title: 'Introduction',
                    url: '#',
                },
                {
                    title: 'Get Started',
                    url: '#',
                },
                {
                    title: 'Tutorials',
                    url: '#',
                },
                {
                    title: 'Changelog',
                    url: '#',
                },
            ],
        },
        {
            title: 'Settings',
            url: '#',
            icon: Settings2,
            items: [
                {
                    title: 'General',
                    url: '#',
                },
                {
                    title: 'Team',
                    url: '#',
                },
                {
                    title: 'Billing',
                    url: '#',
                },
                {
                    title: 'Limits',
                    url: '#',
                },
            ],
        },
    ],
    projects: [
        {
            name: 'Design Engineering',
            url: '#',
            icon: Frame,
        },
        {
            name: 'Sales & Marketing',
            url: '#',
            icon: PieChart,
        },
        {
            name: 'Travel',
            url: '#',
            icon: Map,
        },
    ],
};

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="sidebar">
            <SidebarHeader>
                {/* <SidebarMenu> */}
                {/*     <SidebarMenuItem> */}
                {/*         <SidebarMenuButton size="lg" asChild> */}
                {/*             <Link href="/dashboard" prefetch> */}
                {/*                 <AppLogo /> */}
                {/*             </Link> */}
                {/*         </SidebarMenuButton> */}
                {/*     </SidebarMenuItem> */}
                {/* </SidebarMenu> */}

                <TeamSwitcher teams={data.teams} />
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarMenu>
                        <SidebarMenuButton tooltip={'Dashboard'} asChild>
                            <Link href={route('dashboard')} prefetch>
                                <HomeIcon />
                                Dashboard
                            </Link>
                        </SidebarMenuButton>

                        {/* <SidebarMenuButton tooltip={"Accounts"} asChild> */}
                        {/*     <Link href={route("accounts.index")} prefetch> */}
                        {/*         <LandmarkIcon /> */}
                        {/*         Accounts */}
                        {/*     </Link> */}
                        {/* </SidebarMenuButton> */}
                        {/**/}
                        {/* <SidebarMenuButton tooltip={"Transactions"} asChild> */}
                        {/*     <Link href={route("transactions.index")} prefetch> */}
                        {/*         <DollarSign /> */}
                        {/*         Transactions */}
                        {/*     </Link> */}
                        {/* </SidebarMenuButton> */}
                    </SidebarMenu>
                </SidebarGroup>

                <NavMain items={data.navMain} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
