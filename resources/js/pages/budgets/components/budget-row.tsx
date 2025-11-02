import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { TableCell, TableRow } from '@/components/ui/table';
import { useForm } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';

type BudgetRowProps = {
    budget: App.Http.Resources.BudgetOverviewResource;
    month: string;
};

export const BudgetRow = ({ budget, month }: BudgetRowProps) => {
    const { data, setData, post, processing, reset, errors } = useForm({
        budget_id: budget.id,
        month,
        amount: {
            value: budget.budgeted_amount.value,
            currency: budget.currency,
        },
    });

    const [inputValue, setInputValue] = useState(() => (budget.budgeted_amount.value / 100).toFixed(2));
    const [isDirty, setIsDirty] = useState(false);

    useEffect(() => {
        reset({
            budget_id: budget.id,
            month,
            amount: {
                value: budget.budgeted_amount.value,
                currency: budget.currency,
            },
        });
        setInputValue((budget.budgeted_amount.value / 100).toFixed(2));
        setIsDirty(false);
    }, [budget.id, budget.budgeted_amount.value, budget.currency, month]);

    const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const digitsOnly = event.target.value.replace(/\D/g, '');
        const integerValue = Number(digitsOnly);
        const normalizedValue = Number.isNaN(integerValue) ? 0 : integerValue;

        setData('amount', {
            ...data.amount,
            value: normalizedValue,
        });

        setInputValue((normalizedValue / 100).toFixed(2));
        setIsDirty(normalizedValue !== budget.budgeted_amount.value);
    };

    const submit = (event?: React.FormEvent<HTMLFormElement>) => {
        event?.preventDefault();

        if (!isDirty) {
            return;
        }

        post(route('budgets.allocate'), {
            preserveScroll: true,
        });
    };

    const remainingClassName = useMemo(() => {
        return budget.remaining_amount.value >= 0 ? 'text-emerald-600 font-medium' : 'text-destructive font-medium';
    }, [budget.remaining_amount.value]);

    return (
        <TableRow>
            <TableCell className="align-top">
                <div className="space-y-1">
                    <p className="font-medium leading-none">{budget.category.name}</p>
                    <p className="text-muted-foreground text-xs">Rollover: {budget.rollover_amount.formatted}</p>
                </div>
            </TableCell>
            <TableCell className="align-top">
                <form className="space-y-2" onSubmit={submit}>
                    <div className="flex items-center space-x-2">
                        <span className="text-muted-foreground text-sm font-medium">{budget.currency}</span>
                        <Input
                            className="w-28"
                            inputMode="decimal"
                            value={inputValue}
                            disabled={processing}
                            onBlur={() => submit()}
                            onChange={handleAmountChange}
                        />
                    </div>
                    <InputError message={errors['amount.value'] ?? errors.amount} />
                </form>
            </TableCell>
            <TableCell className="text-right align-top">
                {budget.spent_amount.value === 0 ? (
                    <span className="text-muted-foreground">—</span>
                ) : (
                    <span className="font-medium text-sm">{budget.spent_amount.formatted}</span>
                )}
            </TableCell>
            <TableCell className="text-right align-top">
                <span className={remainingClassName}>{budget.remaining_amount.formatted}</span>
            </TableCell>
        </TableRow>
    );
};
