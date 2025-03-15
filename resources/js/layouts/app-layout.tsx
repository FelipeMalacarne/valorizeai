import { Crumb } from "@/components/breadcrumbs";
import AppLayoutTemplate from "@/layouts/app/app-sidebar-layout";
import { ThemeProvider } from "@/providers/theme-provider";
import { type ReactNode } from "react";

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: Crumb[];
}

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => (
    <ThemeProvider>
        <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
            {children}
        </AppLayoutTemplate>
    </ThemeProvider>
);
