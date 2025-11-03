import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, PaginatedResource, SharedData } from '@/types';
import { Head } from '@inertiajs/react';
import { AccountCard } from './components/account-card';
import { AccountFilters } from './components/account-filters';
import { SectionCards } from './components/section-cards';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { ResponsiveDialog } from '@/components/responsive-dialog';
import { AccountForm } from '@/components/account-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export type AccountIndexProps = {
    accounts: PaginatedResource<App.Http.Resources.AccountResource>;
    banks: App.Http.Resources.BankResource[];
};

const AccountIndex = (props: SharedData<AccountIndexProps>) => {
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

    return (
        <>
            <Head title="Contas" />
            <div className="container mx-auto flex h-full flex-1 flex-col space-y-6 p-4">

                <SectionCards />

                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className='space-y-2'>
                                <CardTitle>Contas Bancárias</CardTitle>
                                <CardDescription> Vizualize e gerencie suas contas Bancárias </CardDescription>
                            </div>

                            <div className='flex space-x-2'>
                                <Button onClick={() => setIsCreateDialogOpen(true)}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    <span>Criar Conta</span>
                                </Button>
                            </div>

                        </div>
                    </CardHeader>

                    <CardContent>
                        <AccountFilters />
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                    {props.accounts.data.map((account) => {
                        return <AccountCard account={account} key={account.id} />;
                    })}
                </div>
            </div>

            <ResponsiveDialog
                title="Nova Conta"
                description="Preencha os campos abaixo para criar uma nova conta."
                isOpen={isCreateDialogOpen}
                setIsOpen={setIsCreateDialogOpen}
            >
                <AccountForm
                    banks={props.banks}
                    onSuccess={() => setIsCreateDialogOpen(false)}
                />
            </ResponsiveDialog>

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
