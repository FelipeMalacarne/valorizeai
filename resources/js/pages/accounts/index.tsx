import { ActionButtonLink } from '@/components/action-button-link';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, PaginatedResource, SharedData } from '@/types';
import { Head } from '@inertiajs/react';
import { AccountCard } from './components/account-card';
import { AccountFilters } from './components/account-filters';
import { SectionCards } from './components/section-cards';

export type AccountIndexProps = {
    accounts: PaginatedResource<App.Http.Resources.AccountResource>;
};

const AccountIndex = (props: SharedData<AccountIndexProps>) => {
    return (
        <>
            <Head title="Contas" />
            <div className="container mx-auto flex h-full flex-1 flex-col space-y-6 p-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-bold tracking-tight">Contas Bancárias</h2>

                    <ActionButtonLink action="create" href={route('accounts.create')} prefetch/>
                </div>

                <SectionCards />

                <AccountFilters />

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
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
