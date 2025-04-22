import {
    Delete,
    Droplet,
    Edit,
    Eye,
    MoreHorizontal,
    View,
    ViewIcon,
} from "lucide-react";
import { Button } from "./ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuRadioGroup,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Row } from "@tanstack/react-table";
import { Link } from "@inertiajs/react";

interface DataTableRowActionsProps<TData> {
    row: Row<TData>;
    viewHref: string;
    editHref: string;
}

export function DataTableRowActions<TData>({
    row,
    viewHref,
    editHref,
}: DataTableRowActionsProps<TData>) {
    // const task = taskSchema.parse(row.original)

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="flex h-4 w-4 p-0 data-[state=open]:bg-muted"
                >
                    <MoreHorizontal />
                    <span className="sr-only">Open menu</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
                <DropdownMenuItem asChild>
                    <Link href={viewHref} prefetch>
                        <Eye /> View
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Edit /> Edit
                </DropdownMenuItem>
                {/* <DropdownMenuItem>Make a copy</DropdownMenuItem>
                <DropdownMenuItem>Favorite</DropdownMenuItem> */}
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <Delete /> Delete
                    <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
