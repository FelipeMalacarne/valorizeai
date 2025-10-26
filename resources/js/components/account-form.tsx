import { Combobox } from '@/components/combobox';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

type AccountFormProps = {
    banks: App.Http.Resources.BankResource[];
    account?: App.Http.Resources.AccountResource;
    onSuccess?: () => void;
};

export const AccountForm = ({ banks, account, onSuccess }: AccountFormProps) => {
    const isUpdate = !!account;

    const { data, setData, post, patch, processing, errors, reset } = useForm({
        name: account?.name ?? '',
        number: account?.number ?? null,
        currency: account?.currency ?? 'BRL',
        type: account?.type.value ?? 'checking',
        bank_id: account?.bank.id ?? '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        const options = {
            onSuccess: () => {
                reset();
                onSuccess?.();
            },
        };
        if (isUpdate) {
            patch(route('accounts.update', account.id), options);
        } else {
            post(route('accounts.store'), options);
        }
    };

    return (
        <form className="space-y-4" onSubmit={submit}>
            <div className="grid space-y-2">
                <Label htmlFor='name'>Nome</Label>
                <Input id="name" type="text" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                <InputError message={errors.name} />
            </div>

            <div className="grid space-y-2">
                <Label htmlFor='number'>Número</Label>
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
                <Label htmlFor='currency'>Moeda</Label>
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
                <InputError message={errors.currency} />
            </div>

            <div className="grid space-y-2">
                <Label htmlFor='bank_id'>Banco</Label>
                <Combobox
                    items={banks.map((bank) => ({ value: bank.id, label: bank.name }))}
                    value={data.bank_id}
                    onChange={(value) => setData('bank_id', value)}
                />
                <InputError message={errors.bank_id} />
            </div>

            <div className="grid space-y-2">
                <Label htmlFor='type'>Tipo</Label>
                <Select onValueChange={(value) => setData('type', value as App.Enums.AccountType)} value={data.type}>
                    <SelectTrigger>
                        <SelectValue placeholder="Selectione um tipo" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="checking">Conta Corrente</SelectItem>
                        <SelectItem value="savings">Poupança</SelectItem>
                        <SelectItem value="investment">Investimentos</SelectItem>
                        <SelectItem value="credit">Cartão de crédito</SelectItem>
                    </SelectContent>
                </Select>
                <InputError message={errors.type} />
            </div>

            <Button type="submit" disabled={processing} className="w-full">
                {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                {isUpdate ? 'Salvar Alterações' : 'Adicionar Conta'}
            </Button>
        </form>
    );
};
