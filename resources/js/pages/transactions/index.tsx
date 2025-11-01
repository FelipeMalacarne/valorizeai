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
import { ArrowDownCircle, ArrowUpCircle, Plus, Upload, Wallet } from 'lucide-react';
import { TransactionsQueryProvider } from '@/providers/transactions-query-provider';
import { TransactionForm } from '@/components/transaction-form';

export type TransactionsIndexProps = {
    transactions: PaginatedResource<App.Http.Resources.TransactionResource>;
    accounts: App.Http.Resources.AccountResource[];
    categories: App.Http.Resources.CategoryResource[];
    summary: {
        balance: App.ValueObjects.Money;
        credits: App.ValueObjects.Money;
        debits: App.ValueObjects.Money;
    };
};

const TransactionsIndex = (props: SharedData<TransactionsIndexProps>) => {
    const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const balanceTone: 'default' | 'positive' | 'negative' =
        props.summary?.balance
            ? props.summary.balance.value > 0
                ? 'positive'
                : props.summary.balance.value < 0
                    ? 'negative'
                    : 'default'
            : 'default';

    return (
        <>
            <Head title="Transações" />
            <div className="container mx-auto flex h-full flex-1 flex-col space-y-6 p-4">
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    <BalanceCard
                        title="Saldo total"
                        amount={props.summary?.balance}
                        description="Entradas menos saídas em todas as contas."
                        icon={<Wallet className="h-5 w-5" />}
                        tone={balanceTone}
                    />
                    <BalanceCard
                        title="Total de entradas"
                        amount={props.summary?.credits}
                        description="Soma de todas as transações de crédito."
                        icon={<ArrowUpCircle className="h-5 w-5" />}
                        tone="positive"
                    />
                    <BalanceCard
                        title="Total de saídas"
                        amount={props.summary?.debits}
                        description="Soma de todas as transações de débito."
                        icon={<ArrowDownCircle className="h-5 w-5" />}
                        tone="negative"
                    />
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
