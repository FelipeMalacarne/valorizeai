import { ResponsiveDialog } from '@/components/responsive-dialog';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Form, usePage } from '@inertiajs/react';
import { Delete, Edit,  MoreHorizontal, Plus } from 'lucide-react';
import { useState } from 'react';
import { AccountForm } from '@/components/account-form';
import { TransactionForm } from '@/components/transaction-form';
import { AccountShowProps } from '../show';
import { SharedData } from '@/types';

export function AccountActionDropdown({ account }: { account: App.Http.Resources.AccountResource }) {
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [addTransactionOpen, setAddTransactionOpen] = useState(false);

    const { banks, all_accounts, categories } = usePage<SharedData<AccountShowProps>>().props;

    return (
        <>
            <DropdownMenu modal={false}>

                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <MoreHorizontal />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setAddTransactionOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        <span>Nova Transação</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setEditDialogOpen(true)}>
                        <Edit className="mr-2 h-4 w-4" />
                        <span>Editar</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setDeleteDialogOpen(true)} className="text-destructive">
                        <Delete className="mr-2 h-4 w-4" />
                        <span>Deletar</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <ResponsiveDialog isOpen={editDialogOpen} setIsOpen={setEditDialogOpen} title="Editar Conta">
                <AccountForm
                    banks={banks}
                    account={account}
                    onSuccess={() => setEditDialogOpen(false)}
                />
            </ResponsiveDialog>

            <ResponsiveDialog isOpen={deleteDialogOpen} setIsOpen={setDeleteDialogOpen} title="Deletar Conta">
                <div>
                    <p>Tem certeza que deseja deletar a conta "{account.name}"? Essa ação não pode ser desfeita.</p>
                    <Form action={route('accounts.destroy', account.id)} method="delete" className="mt-4" onSuccess={() => setDeleteDialogOpen(false)}>
                        <Button type="submit" variant="destructive" className="w-full">
                            Sim, deletar conta
                        </Button>
                    </Form>
                </div>
            </ResponsiveDialog>

            <ResponsiveDialog isOpen={addTransactionOpen} setIsOpen={setAddTransactionOpen} title="Nova Transação">
                 <TransactionForm
                    accounts={all_accounts}
                    categories={categories}
                    defaultAccountId={account.id}
                    onSuccess={() => setAddTransactionOpen(false)}
                />
            </ResponsiveDialog>
        </>
    );
}
