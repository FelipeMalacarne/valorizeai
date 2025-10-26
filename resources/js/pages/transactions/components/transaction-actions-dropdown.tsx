import { ResponsiveDialog } from '@/components/responsive-dialog';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Form, Link, usePage } from '@inertiajs/react';
import { Delete, Edit, Eye, MoreHorizontal, Split } from 'lucide-react';
import { useState } from 'react';
import { SplitTransactionForm } from './split-transaction-form';
import { TransactionForm } from '@/components/transaction-form';
import { TransactionsIndexProps } from '..';
import { SharedData } from '@/types';

export function TransactionActionDropdown({ transaction }: { transaction: App.Http.Resources.TransactionResource }) {
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [splitDialogOpen, setSplitDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const { accounts, categories } = usePage<SharedData<TransactionsIndexProps>>().props;

    return (
        <>
            <DropdownMenu modal={false}>
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

                    <DropdownMenuItem onClick={() => setEditDialogOpen(true)}>
                        <Edit />
                        Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSplitDialogOpen(true)}>
                        <Split />
                        Dividir
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem className="text-destructive" variant="default" onClick={() => setDeleteDialogOpen(true)}>
                        <Delete className="text-destructive" />
                        Deletar
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <ResponsiveDialog
                isOpen={editDialogOpen}
                setIsOpen={setEditDialogOpen}
                title="Atualizar transação"
                description="Atualizar a transação selecionada."
            >
                <TransactionForm
                    accounts={accounts}
                    categories={categories}
                    transaction={transaction}
                    onSuccess={() => setEditDialogOpen(false)}
                />
            </ResponsiveDialog>

            <ResponsiveDialog
                isOpen={splitDialogOpen}
                setIsOpen={setSplitDialogOpen}
                title="Dividir transação"
                description="Divida esta transação em várias partes."
            >
                <SplitTransactionForm transaction={transaction} />
            </ResponsiveDialog>

            <ResponsiveDialog
                isOpen={deleteDialogOpen}
                setIsOpen={setDeleteDialogOpen}
                title="Deletar transação"
                description="Tem certeza de que deseja deletar esta transação? Esta ação não pode ser desfeita."
            >
                <Form
                    action={route('transactions.destroy', transaction.id)}
                    method='DELETE'
                    onSuccess={() => setDeleteDialogOpen(false)}
                >
                    <Button type="submit" className="w-full" variant="destructive">
                        Deletar
                    </Button>
                </Form>
            </ResponsiveDialog>
        </>
    );
}
