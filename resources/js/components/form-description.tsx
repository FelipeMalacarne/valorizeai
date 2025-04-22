import { cn } from "@/lib/utils";

export function FormDescription({
    className,
    children,
}: {
    className?: string;
    children?: React.ReactNode;
}) {
    return (
        <p className={cn("text-muted-foreground text-sm", className)}>
            {children}
        </p>
    );
}
