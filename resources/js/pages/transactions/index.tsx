import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, PaginatedResource, SharedData } from '@/types';
import { Head } from '@inertiajs/react';
import React from 'react';
import { AddTransactionCard } from './components/add-transaction-card';
import { BalanceCard } from './components/balance-card';
import { columns } from './components/columns';
import { TransactionsTable } from './components/transactions-table';

export type TransactionsIndexProps = {
    transactions: PaginatedResource<App.Http.Resources.TransactionResource>;
};

const TransactionsIndex = (props: SharedData<TransactionsIndexProps>) => {
    return (
        <>
            <Head title="Transações" />
            <div className="container mx-auto flex h-full flex-1 flex-col space-y-6 p-4">
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    <AddTransactionCard />
                    <BalanceCard />
                    <BalanceCard />
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Suas Transações</CardTitle>

                        <CardDescription>View and manage your transactions below.</CardDescription>
                    </CardHeader>

                    <CardContent>
                        <TransactionsTable columns={columns} transactions={props.transactions.data} />
                    </CardContent>
                </Card>
            </div>
        </>
    );
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Transactions',
        href: route('transactions.index'),
    },
];

TransactionsIndex.layout = (page: React.ReactNode) => <AppLayout breadcrumbs={breadcrumbs} children={page} />;

export default TransactionsIndex;
