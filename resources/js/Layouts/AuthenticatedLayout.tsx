import { AppSidebar } from "@/components/app-sidebar";
import { Crumb, DynamicBreadcrumbs } from "@/components/DynamicBreadCrumbs";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Separator } from "@/components/ui/separator";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/Providers/ThemeProvider";
import { PropsWithChildren, ReactNode, useState } from "react";

export default function Authenticated({
    breadcrumbs,
    children,
}: PropsWithChildren<{
    breadcrumbs?: Crumb[];
}>) {
    return (
        <ThemeProvider>
            <div className="min-h-screen bg-background">
                <SidebarProvider>
                    <AppSidebar />
                    <SidebarInset>
                        <header className="flex justify-between h-16 px-3 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                            <div className="flex items-center shrink-0 gap-2">
                                <SidebarTrigger />
                                <Separator
                                    orientation="vertical"
                                    className="mr-2 h-4"
                                />

                                {breadcrumbs && (
                                    <DynamicBreadcrumbs items={breadcrumbs} />
                                )}
                            </div>

                            <ThemeToggle className="mr-2" />
                        </header>

                        <Separator />

                        <main className="flex flex-1 flex-col w-full max-w-7xl mx-auto p-4 space-y-4">
                            {children}
                        </main>
                    </SidebarInset>
                </SidebarProvider>
            </div>
            <Toaster />
        </ThemeProvider>
    );
}
