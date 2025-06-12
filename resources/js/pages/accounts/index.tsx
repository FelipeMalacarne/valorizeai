import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, PaginatedResource, SharedData } from '@/types';
import { Head } from '@inertiajs/react';
import useSWR from 'swr';
import { AccountCard } from './components/account-card';
import { SectionCards } from './components/section-cards';
import { Input } from '@/components/ui/input';

export type AccountIndexProps = {
    accounts: PaginatedResource<App.Http.Resources.AccountResource>;
};

const AccountIndex = (props: SharedData<AccountIndexProps>) => {
    console.log('AccountIndex accounts:', props.accounts);
    console.log('AccountIndex banks:', props.banks);

    const { data: banks, isLoading, error } = useSWR<App.Http.Resources.BankResource[]>('/banks');

    console.log('AccountIndex banks from SWR:', banks);

    return (
        <>
            <Head title="Contas" />
            <div className="container mx-auto flex h-full flex-1 flex-col space-y-6 p-4">
                <SectionCards />
                <Input  />
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 xl:grid-cols-4">
                    {props.accounts.data.map((account) => {
                        return <AccountCard account={account} key={account.id} />;
                    })}
                </div>
            </div>
        </>
    );
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Contas',
        href: route('accounts.index'),
    },
];

AccountIndex.layout = (page: React.ReactNode) => <AppLayout breadcrumbs={breadcrumbs} children={page} />;

export default AccountIndex;
