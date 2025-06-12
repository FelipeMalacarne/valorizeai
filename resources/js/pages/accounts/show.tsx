import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, SharedData } from '@/types';
import { Head } from '@inertiajs/react';

export type AccountShowProps = {
    account: App.Http.Resources.AccountResource;
};

const AccountShow = (props: SharedData<AccountShowProps>) => {
    console.log('AccountShow account:', props.account);
    return (
        <>
            <Head title={props.account.name} />
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
