import { Combobox } from '@/components/combobox';
import { DatePicker } from '@/components/date-picker';
import { FormDescription } from '@/components/form-description';
import InputError from '@/components/input-error';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getAccountIcon, getAccountTypeColor } from '@/lib/accounts';
import { useForm } from '@inertiajs/react';
import { format } from 'date-fns';
import { LoaderCircle, Tag, TrendingDown, TrendingUp } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

type TransactionFormProps = {
    accounts: App.Http.Resources.AccountResource[];
    categories: App.Http.Resources.CategoryResource[];
    transaction?: App.Http.Resources.TransactionResource;
    defaultAccountId?: string;
    onSuccess?: () => void;
};

export const TransactionForm = ({ accounts, categories, transaction, defaultAccountId, onSuccess }: TransactionFormProps) => {
    const isUpdate = !!transaction;
    const [type, setType] = useState<'debit' | 'credit'>(transaction?.type ?? 'debit');
    const { data, setData, post, patch, processing, errors, reset, transform } = useForm({
        account_id: transaction?.account.id ?? defaultAccountId ?? '',
        category_id: transaction?.category?.id ?? null,
        amount: {
            value: transaction ? Math.abs(transaction.amount.value) : 0,
            currency: transaction?.amount.currency ?? 'BRL',
        },
        date: transaction ? format(new Date(transaction.date), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
        memo: transaction?.memo ?? null,
    });

    transform((data) => {
        const transformedData: any = {
            ...data,
            amount: {
                ...data.amount,
                value: type === 'debit' ? data.amount.value * -1 : data.amount.value,
            },
        };

        if (isUpdate) {
            delete transformedData.account_id;
        }

        return transformedData;
    });

    const [selectedDate, setSelectedDate] = useState<Date | undefined>(
        transaction ? new Date(transaction.date) : new Date(),
    );

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

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        const options = {
            onSuccess: () => {
                reset();
                onSuccess?.();
            },
        };
        if (isUpdate) {
            patch(route('transactions.update', transaction.id), options);
        } else {
            post(route('transactions.store'), options);
        }
    };

    return (
        <form className="space-y-4" onSubmit={submit}>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="account_id">Conta</Label>
                    <Combobox
                        items={accounts.map((account) => ({ ...account, value: account.id, label: account.name }))}
                        value={data.account_id}
                        disabled={isUpdate}
                        onChange={(value) => {
                            const selectedAccount = accounts.find((account) => account.id === value);
                            if (selectedAccount) {
                                setData((prev) => ({
                                    ...prev,
                                    account_id: selectedAccount.id,
                                    amount: {
                                        ...prev.amount,
                                        currency: selectedAccount.currency,
                                    },
                                }));
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
                    <FormDescription>Selecione a conta para a qual esta transação pertence.</FormDescription>
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
                    <FormDescription>Selecione uma categoria para esta transação (opcional).</FormDescription>
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
                                    <TrendingDown className="text-destructive h-4 w-4" />
                                    <span>Debito</span>
                                </div>
                            </SelectItem>
                            <SelectItem value="credit">
                                <div className="flex items-center space-x-2">
                                    <TrendingUp className="text-primary h-4 w-4" />
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
                    <FormDescription>Selecione a data em que a transação foi efetuada.</FormDescription>
                </div>
            </div>

            <div className="grid space-y-2">
                <Label htmlFor="memo">Memo (opcional)</Label>
                <Input id="memo" type="text" value={data.memo ?? ''} onChange={(e) => setData('memo', e.target.value)} />
                <InputError message={errors.memo} />
                <FormDescription>Adicione uma descrição para identificar esta transação.</FormDescription>
            </div>

            <Button type="submit" disabled={processing} className="w-full">
                {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                {isUpdate ? 'Salvar Alterações' : 'Criar Transação'}
            </Button>
        </form>
    );
};
