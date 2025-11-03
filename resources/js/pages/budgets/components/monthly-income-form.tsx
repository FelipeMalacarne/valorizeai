import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';

type MonthlyIncomeFormProps = {
    month: string;
    income: App.ValueObjects.Money | null;
    currency: App.Enums.Currency;
    onSuccess?: () => void;
};

export const MonthlyIncomeForm = ({ month, income, currency, onSuccess }: MonthlyIncomeFormProps) => {
    const { data, setData, post, processing, errors } = useForm({
        month,
        amount: {
            value: income?.value ?? 0,
            currency: income?.currency ?? currency,
        },
    });

    const [inputValue, setInputValue] = useState(() => ((income?.value ?? 0) / 100).toFixed(2));
    const [isDirty, setIsDirty] = useState(false);

    useEffect(() => {
        setData(() => ({
            month,
            amount: {
                value: income?.value ?? 0,
                currency: income?.currency ?? currency,
            },
        }));
        setInputValue(((income?.value ?? 0) / 100).toFixed(2));
        setIsDirty(false);
    }, [month, income?.value, income?.currency]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const digits = event.target.value.replace(/\D/g, '');
        const centValue = Number(digits);
        const normalized = Number.isNaN(centValue) ? 0 : centValue;

        setData((previous) => ({
            ...previous,
            amount: {
                ...previous.amount,
                value: normalized,
            },
        }));

        setInputValue((normalized / 100).toFixed(2));
        setIsDirty(normalized !== (income?.value ?? 0));
    };

    const submit = (event?: React.FormEvent<HTMLFormElement>) => {
        event?.preventDefault();
        if (!isDirty) return;

        post(route('budgets.monthly-income'), {
            preserveScroll: true,
            onSuccess: () => {
                setIsDirty(false);
                onSuccess?.();
            },
        });
    };

    return (
        <form className="space-y-4" onSubmit={submit}>
            <div className="space-y-2">
                <Label htmlFor="monthly_income">Renda do mês</Label>
                <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-sm font-medium text-muted-foreground">
                        {data.amount.currency}
                    </div>
                    <Input
                        id="monthly_income"
                        className="pl-16"
                        value={inputValue}
                        onChange={handleChange}
                        onBlur={() => submit()}
                        inputMode="decimal"
                        disabled={processing}
                    />
                </div>
                <InputError message={errors['amount.value']} />
            </div>
            <Button type="submit" className="w-full" disabled={processing || !isDirty}>
                Salvar
            </Button>
            <p className="text-xs text-muted-foreground">
                Esse valor será reutilizado automaticamente nos próximos meses até que você o atualize.
            </p>
        </form>
    );
};
