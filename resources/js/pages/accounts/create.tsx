import { Combobox } from '@/components/combobox';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, SharedData } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

export type AccountCreateProps = {
    banks: App.Http.Resources.BankResource[];
};

const AccountCreate = (props: SharedData<AccountCreateProps>) => {
    const { data, setData, post, processing, errors, reset } = useForm<Required<App.Http.Requests.Account.StoreAccountRequest>>({
        name: '',
        number: null,
        currency: 'BRL',
        type: 'checking',
        bank_id: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('accounts.store'), {
            onSuccess: () => reset(),
        });
    };

    return (
        <>
            <Head title="Criar nova" />
            <div className="container mx-auto flex h-full flex-1 flex-col space-y-6 p-4">
                {/* ... */}

                <form className="space-y-4" onSubmit={submit}>
                    <div className="grid space-y-2">
                        <Label>Nome</Label>
                        <Input id="name" type="text" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                        <InputError message={errors.name} />
                    </div>

                    <div className="grid space-y-2">
                        <Label>Número</Label>
                        <Input
                            id="number"
                            type="text"
                            value={data.number ?? ''}
                            onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, '');
                                setData('number', value ? value : null);
                            }}
                        />
                        <InputError message={errors.number} />
                    </div>

                    <div className="grid space-y-2">
                        <Label>Moeda</Label>
                        <Select onValueChange={(value) => setData('currency', value as App.Enums.Currency)} value={data.currency}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selectione uma moeda" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="BRL">BRL</SelectItem>
                                <SelectItem value="USD">USD</SelectItem>
                                <SelectItem value="EUR">EUR</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid space-y-2">
                        <Label>Banco</Label>
                        <Combobox
                            items={props.banks.map((bank) => ({ value: bank.id, label: bank.name }))}
                            value={data.bank_id}
                            onChange={(value) => setData('bank_id', value)}
                        />
                    </div>

                    <div className="grid space-y-2">
                        <Label>Tipo</Label>
                        <Select onValueChange={(value) => setData('type', value as App.Enums.AccountType)} value={data.type}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selectione uma moeda" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="checking">Conta Corrente</SelectItem>
                                <SelectItem value="savings">Poupança</SelectItem>
                                <SelectItem value="investment">Investimentos</SelectItem>
                                <SelectItem value="credit">Cartão de crédito</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <Button type="submit" disabled={processing} className="w-full">
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        Adicionar Conta
                    </Button>
                </form>
            </div>
        </>
    );
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Contas',
        href: route('accounts.index'),
    },
    {
        title: 'Criar',
        href: route('accounts.create'),
    },
];

AccountCreate.layout = (page: React.ReactNode) => <AppLayout breadcrumbs={breadcrumbs} children={page} />;

export default AccountCreate;
