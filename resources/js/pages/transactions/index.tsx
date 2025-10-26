import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, PaginatedResource, SharedData } from '@/types';
import { Head } from '@inertiajs/react';
import React, { useState } from 'react';
import { BalanceCard } from './components/balance-card';
import { columns } from './components/columns';
import { TransactionsTable } from './components/transactions-table';
import { ImportTransactionsForm } from '@/components/import-transactions-form';
import { ResponsiveDialog } from '@/components/responsive-dialog';
import { Button } from '@/components/ui/button';
import { Plus, Upload } from 'lucide-react';
import { TransactionsQueryProvider } from '@/providers/transactions-query-provider';
import { TransactionForm } from '@/components/transaction-form';

export type TransactionsIndexProps = {
    transactions: PaginatedResource<App.Http.Resources.TransactionResource>;
    accounts: App.Http.Resources.AccountResource[];
    categories: App.Http.Resources.CategoryResource[];
};

const TransactionsIndex = (props: SharedData<TransactionsIndexProps>) => {
    const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

    return (
        <>
            <Head title="Transações" />
            <div className="container mx-auto flex h-full flex-1 flex-col space-y-6 p-4">
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    <BalanceCard />
                    <BalanceCard />
                    <BalanceCard />
                </div>
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className='space-y-2'>
                                <CardTitle>Suas Transações</CardTitle>
                                <CardDescription> Veja e gerencie suas transações abaixo </CardDescription>
                            </div>

                            <div className='flex space-x-2'>
                                {/* <ActionButtonLink action="create" href={route('transactions.create')} prefetch /> */}

                                <Button onClick={() => setIsCreateDialogOpen(true)}>
                                    <Plus/>
                                    <span>Criar</span>
                                </Button>

                                <Button onClick={() => setIsImportDialogOpen(true)} variant="outline">
                                    <Upload/>
                                    <span>Importar</span>
                                </Button>
                            </div>

                        </div>
                    </CardHeader>

                    <CardContent>
                        <TransactionsQueryProvider>
                            <TransactionsTable columns={columns} transactions={props.transactions} />
                        </TransactionsQueryProvider>
                    </CardContent>
                </Card>
            </div>

            <ResponsiveDialog
                title="Nova Transação"
                description='Preencha os campos abaixo para criar uma nova transação.'
                isOpen={isCreateDialogOpen}
                setIsOpen={setIsCreateDialogOpen}
            >
                <TransactionForm
                    accounts={props.accounts}
                    categories={props.categories}
                    onSuccess={() => setIsCreateDialogOpen(false)}
                />
            </ResponsiveDialog>

            <ResponsiveDialog
                title="Importar Transações"
                isOpen={isImportDialogOpen}
                setIsOpen={setIsImportDialogOpen}
            >
                <ImportTransactionsForm onClose={() => setIsImportDialogOpen(false)} />
            </ResponsiveDialog>
        </>
    );
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Transações',
        href: route('transactions.index'),
    },
];

TransactionsIndex.layout = (page: React.ReactNode) => <AppLayout breadcrumbs={breadcrumbs} children={page} />;

export default TransactionsIndex;
