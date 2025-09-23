import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, PaginatedResource, SharedData } from '@/types';
import { Head } from '@inertiajs/react';
import React from 'react';
import { BalanceCard } from './components/balance-card';
import { columns } from './components/columns';
import { TransactionsTable } from './components/transactions-table';
import { ActionButtonLink } from '@/components/action-button-link';
import { PageContainer } from '@/components/page-container';

export type TransactionsIndexProps = {
    transactions: PaginatedResource<App.Http.Resources.TransactionResource>;
};

const TransactionsIndex = (props: SharedData<TransactionsIndexProps>) => {
    return (
        <>
            <Head title="Transações" />
            <PageContainer>
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

                            <ActionButtonLink action="create" href={route('transactions.create')} prefetch />
                        </div>
                    </CardHeader>

                    <CardContent>
                        <TransactionsTable columns={columns} transactions={props.transactions.data} />
                    </CardContent>
                </Card>
            </PageContainer>
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
