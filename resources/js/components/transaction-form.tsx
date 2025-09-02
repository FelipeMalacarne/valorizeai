import { Combobox } from '@/components/combobox';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useState } from 'react';
import { DatePicker } from '@/components/date-picker';
import { format } from 'date-fns';
import { FormDescription } from '@/components/form-description';

type TransactionFormProps = {
    accounts: App.Http.Resources.AccountResource[];
    categories: App.Http.Resources.CategoryResource[];
    onSuccess?: () => void;
};

export const TransactionForm = ({ accounts, categories, onSuccess }: TransactionFormProps) => {
    const { data, setData, post, processing, errors, reset } = useForm<Required<App.Http.Requests.Transaction.StoreTransactionRequest>>({
        account_id: '',
        category_id: null,
        amount: {
            value: 0,
            currency: 'BRL',
        },
        type: 'debit',
        date: format(new Date(), 'yyyy-MM-dd'),
        memo: null,
    });

    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

    const handleDateChange = (date: Date | undefined) => {
        setSelectedDate(date);
        if (date) {
            setData('date', format(date, 'yyyy-MM-dd'));
        }
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('transactions.store'), {
            onSuccess: () => {
                reset();
                onSuccess?.();
            },
        });
    };

    return (
        <form className="space-y-4" onSubmit={submit}>
            <div className="grid space-y-2">
                <Label htmlFor="account_id">Conta</Label>
                <Combobox
                    items={accounts.map((account) => ({ value: account.id, label: account.name }))}
                    value={data.account_id}
                    onChange={(value) => setData('account_id', value)}
                    placeholder="Selecione uma conta"
                />
                <InputError message={errors.account_id} />
            </div>

            <div className="grid space-y-2">
                <Label htmlFor="category_id">Categoria</Label>
                <Combobox
                    items={categories.map((category) => ({ value: category.id, label: category.name }))}
                    value={data.category_id}
                    onChange={(value) => setData('category_id', value)}
                    placeholder="Selecione uma categoria (opcional)"
                    noResultsText="Nenhuma categoria encontrada."
                />
                <InputError message={errors.category_id} />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="grid space-y-2">
                    <Label htmlFor="amount_value">Valor</Label>
                    <Input
                        id="amount_value"
                        type="number"
                        step="0.01"
                        value={data.amount.value}
                        onChange={(e) => setData('amount', { ...data.amount, value: parseFloat(e.target.value) })}
                    />
                    <InputError message={errors['amount.value']} />
                </div>

                <div className="grid space-y-2">
                    <Label htmlFor="amount_currency">Moeda</Label>
                    <Select
                        onValueChange={(value) => setData('amount', { ...data.amount, currency: value as App.Enums.Currency })}
                        value={data.amount.currency}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Selecione uma moeda" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="BRL">BRL</SelectItem>
                            <SelectItem value="USD">USD</SelectItem>
                            <SelectItem value="EUR">EUR</SelectItem>
                        </SelectContent>
                    </Select>
                    <InputError message={errors['amount.currency']} />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="grid space-y-2">
                    <Label htmlFor="type">Tipo</Label>
                    <Select onValueChange={(value) => setData('type', value as App.Enums.TransactionType)} value={data.type}>
                        <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="debit">Débito</SelectItem>
                            <SelectItem value="credit">Crédito</SelectItem>
                        </SelectContent>
                    </Select>
                    <InputError message={errors.type} />
                </div>

                <div className="grid space-y-2">
                    <Label htmlFor="date">Data</Label>
                    <DatePicker date={selectedDate} setDate={handleDateChange} />
                    <InputError message={errors.date} />
                </div>
            </div>

            <div className="grid space-y-2">
                <Label htmlFor="memo">Memo (opcional)</Label>
                <Input
                    id="memo"
                    type="text"
                    value={data.memo ?? ''}
                    onChange={(e) => setData('memo', e.target.value)}
                />
                <FormDescription>Uma breve descrição da transação.</FormDescription>
                <InputError message={errors.memo} />
            </div>

            <Button type="submit" disabled={processing} className="w-full">
                {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                Criar Transação
            </Button>
        </form>
    );
};
