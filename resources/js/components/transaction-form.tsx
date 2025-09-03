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
import { cn } from '@/lib/utils';
import { categoryBadgeVariants } from '@/lib/categories';

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
        console.log('Amount before transform (from data state):', data.amount.value);

        // Store the original value to revert later
        const originalAmountValue = data.amount.value;

        // Calculate the transformed integer value
        const transformedAmountValue = Math.round(originalAmountValue * 100);

        // Update the form's internal data state with the transformed value
        // This is the key change to ensure Inertia sends the correct value
        setData('amount', {
            ...data.amount,
            value: transformedAmountValue,
        });

        console.log('Amount after updating data state (should be integer):', data.amount.value);

        // Now, call post. Inertia will use the updated 'data' state.
        post(route('transactions.store'), {
            onSuccess: () => {
                reset(); // This will reset the form, including amount.value
                onSuccess?.();
            },
            onFinish: () => {
                // If onSuccess is not called (e.g., validation error),
                // we need to revert the amount.value in the data state
                // back to its original decimal form for display.
                // If reset() is called on success, this might not be strictly necessary for success case.
                // But for validation errors, it's crucial.
                if (!processing) { // Check if processing is false, meaning request finished
                    setData('amount', {
                        ...data.amount, // Use current data.amount to preserve currency
                        value: originalAmountValue, // Revert to original decimal for display
                    });
                }
            }
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
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            value={data.amount.value / 100} // Display as decimal
                            onChange={(e) => {
                                const decimalValue = parseFloat(e.target.value);
                                const integerValue = Math.round(decimalValue * 100);
                                setData('amount', { ...data.amount, value: integerValue || 0 }); // Store as integer
                            }}
                            disabled={!data.account_id}
                            className="pl-14"
                        />
                    </div>
                    <InputError message={errors['amount.value']} />
                </div>

                <div className="grid space-y-2">
                    <Label htmlFor="type">Tipo</Label>
                    <Select onValueChange={(value) => setData('type', value as App.Enums.TransactionType)} value={data.type} disabled={!data.account_id}>
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
                    <InputError message={errors.type} />
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
