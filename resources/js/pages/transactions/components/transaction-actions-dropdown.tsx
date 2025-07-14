import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Link } from '@inertiajs/react';
import { Delete, Edit, Eye, MoreHorizontal, Split } from 'lucide-react';

export function TransactionActionDropdown({ transaction }: { transaction: App.Http.Resources.TransactionResource }) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="data-[state=open]:bg-muted text-muted-foreground flex size-8" size="icon">
                    <MoreHorizontal />
                    <span className="sr-only">Open menu</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32">

                <DropdownMenuItem asChild>
                    <Link href={route('transactions.show', transaction.id)} prefetch>
                        <Eye />
                        Ver
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuItem>
                    <Edit />
                    Edit
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Split />
                    Split
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem className="text-destructive" variant="default">
                    <Delete className="text-destructive" />
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
