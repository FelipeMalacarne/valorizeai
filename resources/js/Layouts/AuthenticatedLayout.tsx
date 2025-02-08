import { AppSidebar } from "@/Components/app-sidebar";
import { Crumb, DynamicBreadcrumbs } from "@/Components/DynamicBreadCrumbs";
import { ThemeToggle } from "@/Components/ThemeToggle";
import { Separator } from "@/Components/ui/separator";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/Components/ui/sidebar";
import { Toaster } from "@/Components/ui/toaster";
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
                                <Separator orientation="vertical" className="mr-2 h-4" />

                                {breadcrumbs &&
                                    <DynamicBreadcrumbs items={breadcrumbs} />
                                }

                            </div>

                            <ThemeToggle className="mr-2" />
                        </header>

                        <Separator />

                        <main className="flex flex-1 flex-col gap-4 p-4">
                            {children}
                        </main>
                    </SidebarInset>
                </SidebarProvider>
            </div>
            <Toaster />
        </ThemeProvider>
    );
}
