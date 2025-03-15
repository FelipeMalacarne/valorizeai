import * as React from "react";
import { type ComponentType } from "react";
import {
    AudioWaveform,
    BookOpen,
    Bot,
    Command,
    DollarSign,
    Folder,
    Frame,
    GalleryVerticalEnd,
    HomeIcon,
    LandmarkIcon,
    LucideProps,
    Map,
    PieChart,
    Settings2,
    SquareTerminal,
} from "lucide-react";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarRail,
} from "@/components/ui/sidebar";
import { NavMain } from "@/components/nav-main";
import { TeamSwitcher } from "@/components/team-switcher";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { Link, router, usePage } from "@inertiajs/react";
import { NavFooter } from "./nav-footer";
const data = {
    user: {
        name: "shadcn",
        email: "m@example.com",
        avatar: "/avatars/shadcn.jpg",
    },
    teams: [
        {
            name: "Acme Inc",
            logo: GalleryVerticalEnd,
            plan: "Enterprise",
        },
        {
            name: "Acme Corp.",
            logo: AudioWaveform,
            plan: "Startup",
        },
        {
            name: "Evil Corp.",
            logo: Command,
            plan: "Free",
        },
    ],
    navMain: [
        {
            title: "Playground",
            url: "#",
            icon: SquareTerminal,
            isActive: true,
            items: [
                {
                    title: "History",
                    url: "#",
                },
                {
                    title: "Starred",
                    url: "#",
                },
                {
                    title: "Settings",
                    url: "#",
                },
            ],
        },
        {
            title: "Models",
            url: "#",
            icon: Bot,
            items: [
                {
                    title: "Genesis",
                    url: "#",
                },
                {
                    title: "Explorer",
                    url: "#",
                },
                {
                    title: "Quantum",
                    url: "#",
                },
            ],
        },
        {
            title: "Documentation",
            url: "#",
            icon: BookOpen,
            items: [
                {
                    title: "Introduction",
                    url: "#",
                },
                {
                    title: "Get Started",
                    url: "#",
                },
                {
                    title: "Tutorials",
                    url: "#",
                },
                {
                    title: "Changelog",
                    url: "#",
                },
            ],
        },
        {
            title: "Settings",
            url: "#",
            icon: Settings2,
            items: [
                {
                    title: "General",
                    url: "#",
                },
                {
                    title: "Team",
                    url: "#",
                },
                {
                    title: "Billing",
                    url: "#",
                },
                {
                    title: "Limits",
                    url: "#",
                },
            ],
        },
    ],
    projects: [
        {
            name: "Design Engineering",
            url: "#",
            icon: Frame,
        },
        {
            name: "Sales & Marketing",
            url: "#",
            icon: PieChart,
        },
        {
            name: "Travel",
            url: "#",
            icon: Map,
        },
    ],
};

export type NavItem = {
    title: string;
    url: string;
    // icon?: React.ComponentType<React.ComponentProps<typeof Icon>>;
    icon?: ComponentType<LucideProps>;
};

const footerNavItems: NavItem[] = [
    {
        title: "Repository",
        url: "https://github.com/laravel/react-starter-kit",
        icon: Folder,
    },
    {
        title: "Documentation",
        url: "https://laravel.com/docs/starter-kits",
        icon: BookOpen,
    },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                {/* <ApplicationLogo className="h-12" />
                <AppLogo /> */}
                <TeamSwitcher teams={data.teams} />
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarMenu>
                        <Link href={route("dashboard")} prefetch>
                            <SidebarMenuButton tooltip={"Dashboard"}>
                                <HomeIcon />
                                Dashboard
                            </SidebarMenuButton>
                        </Link>

                        <Link href={route("accounts.index")} prefetch>
                            <SidebarMenuButton tooltip={"Accounts"}>
                                <LandmarkIcon />
                                Accounts
                            </SidebarMenuButton>
                        </Link>

                        <Link href={route("transactions.index")} prefetch>
                            <SidebarMenuButton tooltip={"Transactions"}>
                                <DollarSign />
                                Transactions
                            </SidebarMenuButton>
                        </Link>
                    </SidebarMenu>
                </SidebarGroup>
                <NavMain items={data.navMain} />
                <NavProjects projects={data.projects} />
            </SidebarContent>
            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
