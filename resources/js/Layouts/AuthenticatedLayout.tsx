import { AppSidebar } from "@/Components/app-sidebar";
import { ThemeToggle } from "@/Components/ThemeToggle";
import { Separator } from "@/Components/ui/separator";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/Components/ui/sidebar";
import { ThemeProvider } from "@/Providers/ThemeProvider";
import { PropsWithChildren, ReactNode, useState } from "react";

export default function Authenticated({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    return (
        <ThemeProvider>
            <div className="min-h-screen bg-background">
                <SidebarProvider>
                    <AppSidebar />
                    <SidebarInset>
                        <header className="flex justify-between h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                            <SidebarTrigger className="ml-2" />

                            <div>search</div>
                            <ThemeToggle className="mr-2" />
                        </header>

                        <Separator />

                        <main className="flex flex-1 flex-col gap-4 p-4">
                            {children}
                        </main>
                    </SidebarInset>
                </SidebarProvider>
            </div>
        </ThemeProvider>
    );
}
