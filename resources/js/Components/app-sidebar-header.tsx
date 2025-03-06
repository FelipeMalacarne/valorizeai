import { Breadcrumbs, Crumb } from "@/components/breadcrumbs";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "./ui/separator";
import { ThemeToggle } from "./ThemeToggle";

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: Crumb[];
}) {
    return (
        <header className="border-sidebar-border/50 flex h-16 shrink-0 items-center gap-2 border-b px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>
            <ThemeToggle className="mr-2" />
        </header>
    );
}
