import { DataTable } from '@/components/data-table';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, PaginatedResource, SharedData } from '@/types';
import { Head } from '@inertiajs/react';
import React from 'react';
import { AddTransactionCard } from './components/add-transaction-card';
import { BalanceCard } from './components/balance-card';
import { columns } from './components/columns';

export type TransactionsIndexProps = {
    transactions: PaginatedResource<App.Http.Resources.TransactionResource>;
};

const TransactionsIndex = (props: SharedData<TransactionsIndexProps>) => {
    return (
        <>
            <Head title="Index" />
            <div className="container mx-auto flex h-full flex-1 flex-col space-y-6 p-4">
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    <AddTransactionCard />
                    <BalanceCard />
                    <BalanceCard />
                </div>
                <DataTable columns={columns} data={props.transactions.data} />
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
