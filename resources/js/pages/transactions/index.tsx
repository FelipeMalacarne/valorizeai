import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, PaginatedResource, SharedData } from '@/types';
import { Head } from '@inertiajs/react';
import React from 'react';
import { BalanceCard } from './components/balance-card';
import { columns } from './components/columns';
import { TransactionsTable } from './components/transactions-table';
import { ActionButtonLink } from '@/components/action-button-link';

export type TransactionsIndexProps = {
    transactions: PaginatedResource<App.Http.Resources.TransactionResource>;
};

const TransactionsIndex = (props: SharedData<TransactionsIndexProps>) => {
    return (
        <>
            <Head title="Transações" />
            <div className="container mx-auto flex h-full flex-1 flex-col space-y-6 p-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-bold tracking-tight">Transações</h2>
                    <ActionButtonLink action="create" href={route('transactions.create')} prefetch />
                </div>
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    <BalanceCard />
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
