import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, PaginatedResource, SharedData } from '@/types';
import { Head } from '@inertiajs/react';
import { AccountCard } from './components/account-card';
import { AccountFilters } from './components/account-filters';
import { SectionCards } from './components/section-cards';
import { PageContainer } from '@/components/page-container';

export type AccountIndexProps = {
    accounts: PaginatedResource<App.Http.Resources.AccountResource>;
};

const AccountIndex = (props: SharedData<AccountIndexProps>) => {
    return (
        <>
            <Head title="Contas" />
            <PageContainer>

                <SectionCards />

                <AccountFilters />

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                    {props.accounts.data.map((account) => {
                        return <AccountCard account={account} key={account.id} />;
                    })}
                </div>
            </PageContainer>
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
