import { Combobox } from '@/components/combobox';
import InputError from '@/components/input-error';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getAccountIcon, getAccountTypeColor } from '@/lib/accounts';
import { useForm } from '@inertiajs/react';
import { LoaderCircle, Tag, TrendingDown, TrendingUp } from 'lucide-react';
import { FormEventHandler, useState } from 'react';
import { DatePicker } from '@/components/date-picker';
import { format } from 'date-fns';
import { FormDescription } from '@/components/form-description';
import { Badge } from '@/components/ui/badge';

type TransactionFormProps = {
    accounts: App.Http.Resources.AccountResource[];
    categories: App.Http.Resources.CategoryResource[];
    onSuccess?: () => void;
};

export const TransactionForm = ({ accounts, categories, onSuccess }: TransactionFormProps) => {
    const [type, setType] = useState<'debit' | 'credit'>('debit');
    const { data, setData, post, processing, errors, reset, transform } = useForm({
        account_id: '',
        category_id: null,
        amount: {
            value: 0,
            currency: 'BRL',
        },
        date: format(new Date(), 'yyyy-MM-dd'),
        memo: null,
    });

    transform((data) => ({
        ...data,
        amount: {
            ...data.amount,
            value: type === 'debit' ? data.amount.value * -1 : data.amount.value,
        },
    }));

    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

    const handleDateChange = (date: Date | undefined) => {
        setSelectedDate(date);
        if (date) {
            setData('date', format(date, 'yyyy-MM-dd'));
        }
    };

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        const digitsOnly = inputValue.replace(/\D/g, '');
        const integerValue = parseInt(digitsOnly, 10);
        setData('amount', { ...data.amount, value: integerValue || 0 });
    };

    // The submit handler is now clean
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
            <div className='grid grid-cols-2 gap-4'>
            <div className="space-y-2">
                <Label htmlFor="account_id">Conta</Label>
                <Combobox
                    items={accounts.map((account) => ({ ...account, value: account.id, label: account.name }))}
                    value={data.account_id}
                    onChange={(value) => {
                        const selectedAccount = accounts.find((account) => account.id === value);
                        if (selectedAccount) {
                            setData((prev) => ({
                                ...prev,
                                account_id: selectedAccount.id,
                                amount: {
                                    ...prev.amount,
                                    currency: selectedAccount.currency
                                }
                            }))
                        } else {
                            setData('account_id', '');
                        }
                    }}
                    placeholder="Selecione uma conta"
                    renderItem={(account: App.Http.Resources.AccountResource) => {
                        const Icon = getAccountIcon(account.type);
                        return (
                            <div className="flex w-full items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <Avatar className="h-6 w-6">
                                        <AvatarFallback className={getAccountTypeColor(account.type)}>
                                            <Icon className="h-4 w-4" />
                                        </AvatarFallback>
                                    </Avatar>
                                    <span>{account.name}</span>
                                </div>
                                <Badge variant="outline">{account.balance.formatted}</Badge>
                            </div>
                        );
                    }}
                />
                <InputError message={errors.account_id} />
            </div>

            <div className="grid space-y-2">
                <Label htmlFor="category_id">Categoria</Label>
                <Combobox
                    items={categories.map((category) => ({ ...category, value: category.id, label: category.name }))}
                    value={data.category_id}
                    onChange={(value) => setData('category_id', value)}
                    placeholder="Selecione uma categoria (opcional)"
                    noResultsText="Nenhuma categoria encontrada."
                    renderItem={(category: App.Http.Resources.CategoryResource) => {
                        return (
                            <div className="flex items-center space-x-2">
                                <Tag className={`h-4 w-4 text-${category.color}`} />
                                <span>{category.name}</span>
                            </div>
                        );
                    }}
                />
                <InputError message={errors.category_id} />
            </div>

            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="grid space-y-2">
                    <Label htmlFor="amount_value">Valor</Label>
                    <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <span className="text-muted-foreground">{data.amount.currency}</span>
                        </div>
                        <Input
                            id="amount_value"
                            type="text"
                            placeholder="0.00"
                            value={(data.amount.value / 100).toFixed(2)}
                            onChange={handleAmountChange}
                            disabled={!data.account_id}
                            className="pl-14"
                        />
                    </div>
                    <InputError message={errors['amount.value']} />
                </div>

                <div className="grid space-y-2">
                    <Label htmlFor="type">Tipo</Label>
                    <Select onValueChange={(value) => setType(value as 'debit' | 'credit')} value={type} disabled={!data.account_id}>
                        <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="debit">
                        <div className="flex items-center space-x-2">
                          <TrendingDown className="h-4 w-4 text-destructive" />
                          <span>Debito</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="credit">
                        <div className="flex items-center space-x-2">
                          <TrendingUp className="h-4 w-4 text-primary" />
                          <span>Credito</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                    </Select>
                </div>

            </div>

            <div className="grid gap-4">
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
