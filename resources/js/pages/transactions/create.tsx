import { TransactionForm } from '@/components/transaction-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, SharedData } from '@/types';
import { Head } from '@inertiajs/react';
import { format } from 'date-fns';

export type TransactionCreateProps = {
    accounts: App.Http.Resources.AccountResource[];
    categories: App.Http.Resources.CategoryResource[];
    recent_transactions: App.Http.Resources.TransactionResource[];
};

const RecentTransactions = ({ transactions }: { transactions: App.Http.Resources.TransactionResource[] }) => (
    <Card>
        <CardHeader>
            <CardTitle>Últimas Transações</CardTitle>
        </CardHeader>
        <CardContent>
            <ul className="space-y-4">
                {transactions.map((transaction) => (
                    <li key={transaction.id} className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">{transaction.memo ?? 'N/A'}</p>
                            <p className="text-sm text-muted-foreground">{transaction.category?.name ?? 'N/A'}</p>
                        </div>
                        <div className="text-right">
                            <p
                                className={`font-medium ${transaction.type === 'debit' ? 'text-red-500' : 'text-green-500'}`}
                            >
                                {transaction.amount.formatted}
                            </p>
                            <p className="text-sm text-muted-foreground">{format(new Date(transaction.date), 'dd/MM/yy')}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </CardContent>
    </Card>
);

const TransactionCreate = (props: SharedData<TransactionCreateProps>) => {
    return (
        <>
            <Head title="Criar Transação" />
            <div className="container mx-auto flex h-full flex-1 flex-col space-y-6 p-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-bold tracking-tight">Criar Nova Transação</h2>
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Nova Transação</CardTitle>
                                <CardDescription>Preencha os campos abaixo para criar uma nova transação.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <TransactionForm accounts={props.accounts} categories={props.categories} />
                            </CardContent>
                        </Card>
                    </div>
                    <div>
                        <RecentTransactions transactions={props.recent_transactions} />
                    </div>
                </div>
            </div>
        </>
    );
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Transações',
        href: route('transactions.index'),
    },
    {
        title: 'Criar',
        href: route('transactions.create'),
    },
];

TransactionCreate.layout = (page: React.ReactNode) => <AppLayout breadcrumbs={breadcrumbs} children={page} />;

export default TransactionCreate;
