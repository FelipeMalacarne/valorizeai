import {
    Delete,
    Edit,
    Eye,
    MoreHorizontal,
} from "lucide-react";
import { Button } from "./ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Link } from "@inertiajs/react";

interface ActionDropdownProps {
    viewHref?: string;
    editHref?: string;
    onEdit?: () => void;
    onDelete?: () => void;
    onView?: () => void;
}

export function ActionDropdown({
    viewHref,
    editHref,
    onEdit,
    onDelete,
    onView,
}: ActionDropdownProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="flex h-6 w-6 p-0 data-[state=open]:bg-muted"
                >
                    <MoreHorizontal />
                    <span className="sr-only">Open menu</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
                {(viewHref || onView) && (
                    <DropdownMenuItem asChild={!!viewHref}>
                        {viewHref ? (
                            <Link href={viewHref} prefetch>
                                <Eye /> View
                            </Link>
                        ) : (
                            <button onClick={onView} className="flex w-full items-center gap-2">
                                <Eye /> View
                            </button>
                        )}
                    </DropdownMenuItem>
                )}

                {(editHref || onEdit) && (
                    <DropdownMenuItem asChild={!!editHref}>
                        {editHref ? (
                            <Link href={editHref} prefetch>
                                <Edit /> Edit
                            </Link>
                        ) : (
                            <button onClick={onEdit} className="flex w-full items-center gap-2">
                                <Edit /> Edit
                            </button>
                        )}
                    </DropdownMenuItem>
                )}

                {onDelete && (
                    <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <button onClick={onDelete} className="flex w-full items-center gap-2">
                                <Delete /> Delete
                                <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
                            </button>
                        </DropdownMenuItem>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
