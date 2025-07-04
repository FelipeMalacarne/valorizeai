import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, SharedData } from '@/types';
import { Head } from '@inertiajs/react';
import React from 'react';

export type TransactionsIndexProps = {};

const TransactionsIndex = (props: SharedData<TransactionsIndexProps>) => {
    return (
        <>
            <Head title="Index" />
            <div className="container mx-auto flex h-full flex-1 flex-col space-y-6 p-4">{/* ... */}</div>
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
