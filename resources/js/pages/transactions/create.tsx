import { TransactionForm } from '@/components/transaction-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, SharedData } from '@/types';
import { Head } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { RecentTransactions } from './components/recent-transactions';

export type TransactionCreateProps = {
    accounts: App.Http.Resources.AccountResource[];
    categories: App.Http.Resources.CategoryResource[];
    recent_transactions: App.Http.Resources.TransactionResource[];
};

const TransactionCreate = (props: SharedData<TransactionCreateProps>) => {
    return (
        <>
            <Head title="Criar Transação" />
            <div className="container mx-auto flex h-full flex-1 flex-col space-y-6 p-4">
                <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
                    <Card className="col-span-1 xl:col-span-2 flex flex-col justify-between">
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Plus className="h-5 w-5" />
                                <span>Nova Transação</span>
                            </CardTitle>
                            <CardDescription>Preencha os campos abaixo para criar uma nova transação.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <TransactionForm accounts={props.accounts} categories={props.categories} />
                        </CardContent>
                    </Card>

                    <RecentTransactions transactions={props.recent_transactions} />
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
