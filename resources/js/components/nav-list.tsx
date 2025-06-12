import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';

export function NavList({ label = 'Plataforma', items }: { label: string; items: NavItem[] }) {
    const page = usePage();
    return (
        <SidebarGroup>
            <SidebarGroupLabel>{label}</SidebarGroupLabel>

            <SidebarMenu>
                {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        <Link href={item.href} prefetch>
                            <SidebarMenuButton tooltip={item.title} isActive={item.href === page.url}>
                                {item.icon && <item.icon />}
                                <span>{item.title}</span>
                            </SidebarMenuButton>
                        </Link>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
