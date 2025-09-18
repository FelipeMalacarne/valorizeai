import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, SharedData } from '@/types';
import { Head } from '@inertiajs/react';

export type TransactionsShowProps = {
    transaction: App.Http.Resources.TransactionResource;
};

const TransactionsShow = (props: SharedData<TransactionsShowProps>) => {
    console.log(props.transaction);
    return (
        <>
            <Head title="Vizualizar" />
            <div className="container mx-auto flex h-full flex-1 flex-col space-y-6 p-4">{/* ... */}</div>
        </>
    );
};

TransactionsShow.layout = (page: any) => {
    const props = page.props as SharedData<TransactionsShowProps>;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Transações',
            href: route('transactions.index'),
        },
        {
            title: props.transaction.id,
            href: route('transactions.show', props.transaction.id),
        },
    ];

    return <AppLayout breadcrumbs={breadcrumbs} children={page} />;
};

export default TransactionsShow;
