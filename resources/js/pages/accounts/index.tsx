import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, PaginatedResource, SharedData } from '@/types';
import { Head } from '@inertiajs/react';
import useSWR from 'swr';

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
