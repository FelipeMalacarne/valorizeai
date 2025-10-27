import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, SharedData } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { getAccountIcon, getAccountTypeColor } from '@/lib/accounts';
import { AccountActionDropdown } from './components/account-actions-dropdown';
import { SpendingChart } from './components/spending-chart';

export type AccountShowProps = {
    account: App.Http.Resources.AccountResource;
    recent_transactions: App.Http.Resources.TransactionResource[];
    spending_summary: any[]; // You can define a more specific type here
    banks: App.Http.Resources.BankResource[];
    all_accounts: App.Http.Resources.AccountResource[];
    categories: App.Http.Resources.CategoryResource[];
};

const AccountShow = (props: SharedData<AccountShowProps>) => {
    const { account, recent_transactions, spending_summary } = props;
    const AccountIcon = getAccountIcon(account.type);

    return (
        <>
            <Head title={account.name} />
            <div className="container mx-auto flex h-full flex-1 flex-col space-y-6 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">{account.name}</h1>
                    <AccountActionDropdown account={account} />
                </div>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                    {/* Main Column */}
                    <div className="flex flex-col gap-4 lg:col-span-2">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <Avatar className="h-12 w-12">
                                        <AvatarFallback className={getAccountTypeColor(account.type)}>
                                            <AccountIcon className="h-6 w-6" />
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <CardTitle>{account.name}</CardTitle>
                                        <CardDescription>{account.bank.name} - {account.type}</CardDescription>
                                    </div>
                                </div>
                                <div className='text-2xl font-bold'>{account.balance.formatted}</div>
                            </CardHeader>
                            <CardContent className='space-y-4 divide-y'>
                                <div className='flex justify-between pt-4'>
                                    <span className='text-muted-foreground'>Moeda</span>
                                    <span>{account.currency}</span>
                                </div>
                                {account.number && (
                                    <div className='flex justify-between pt-4'>
                                        <span className='text-muted-foreground'>Número da conta</span>
                                        <span>{account.number}</span>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Transações Recentes</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {recent_transactions.length > 0 ? (
                                        recent_transactions.map((transaction) => (
                                            <Link href={route('transactions.show', transaction.id)} key={transaction.id} className="flex items-center rounded-md p-2 transition-colors hover:bg-muted/50">
                                                <Avatar className="h-9 w-9">
                                                    <AvatarFallback>{transaction.category?.name.charAt(0) ?? 'T'}</AvatarFallback>
                                                </Avatar>
                                                <div className="ml-4 space-y-1">
                                                    <p className="text-sm font-medium leading-none">{transaction.memo ?? 'Transação'}</p>
                                                    <p className="text-sm text-muted-foreground">{new Date(transaction.date).toLocaleDateString()}</p>
                                                </div>
                                                <div className="ml-auto font-medium">{transaction.amount.formatted}</div>
                                            </Link>
                                        ))
                                    ) : (
                                        <div className='text-center text-muted-foreground py-8'>Nenhuma transação recente.</div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar Column */}
                    <div className="grid gap-4 lg:col-span-1">
                        <Card>
                            <CardHeader>
                                <CardTitle>Resumo de Gastos</CardTitle>
                                <CardDescription>
                                    Seus gastos por categoria este mês.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <SpendingChart data={spending_summary} />
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Atividade</CardTitle>
                                <CardDescription>
                                    Um resumo da sua atividade recente.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className='text-center text-muted-foreground pt-8'>Em breve</div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
};

AccountShow.layout = (page: any) => {
    const props = page.props as SharedData<AccountShowProps>;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Contas',
            href: route('accounts.index'),
        },
        {
            title: props.account.name,
            href: route('accounts.show', props.account.id),
        },
    ];

    return <AppLayout breadcrumbs={breadcrumbs} children={page} />;
};

export default AccountShow;
