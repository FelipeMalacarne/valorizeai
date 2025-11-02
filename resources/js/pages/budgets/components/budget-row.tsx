import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { TableCell, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
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

    const availableAmount = budget.rollover_amount.value + budget.budgeted_amount.value;
    const overspent = budget.remaining_amount.value < 0;
    const progressBase = availableAmount > 0 ? availableAmount : Math.max(budget.spent_amount.value, 1);
    const consumption = progressBase === 0 ? 0 : Math.min(100, Math.round((budget.spent_amount.value / progressBase) * 100));
    const badgeTone = overspent ? 'destructive' : 'secondary';
    const badgeLabel = overspent ? 'Estourado' : 'Em dia';

    const remainingClassName = useMemo(
        () =>
            cn(
                'text-sm font-semibold',
                budget.remaining_amount.value > 0 && 'text-emerald-600',
                budget.remaining_amount.value === 0 && 'text-muted-foreground',
                overspent && 'text-destructive',
            ),
        [budget.remaining_amount.value, overspent],
    );

    return (
        <TableRow
            className={cn(
                'transition-colors hover:bg-muted/40',
                overspent && 'bg-destructive/5 hover:bg-destructive/10',
            )}
        >
            <TableCell className="align-top">
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <p className="font-medium leading-none">{budget.category.name}</p>
                        <Badge variant={badgeTone as 'destructive' | 'secondary'}>{badgeLabel}</Badge>
                    </div>
                    <p className="text-muted-foreground text-xs">
                        Saldo anterior: <span className="font-medium text-foreground">{budget.rollover_amount.formatted}</span>
                    </p>
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
                    <p className="text-xs text-muted-foreground">
                        Planejado: <span className="font-medium text-foreground">{budget.budgeted_amount.formatted}</span>
                    </p>
                </form>
            </TableCell>
            <TableCell className="text-right align-top">
                <div className="space-y-2">
                    <div className="flex flex-col items-end gap-1">
                        <span className="text-sm font-medium text-foreground">{budget.spent_amount.formatted}</span>
                        <span className="text-xs text-muted-foreground">{consumption}% utilizado</span>
                    </div>
                    <Progress value={consumption} className="ml-auto h-2 w-[160px]" />
                </div>
            </TableCell>
            <TableCell className="text-right align-top">
                <div className="space-y-1">
                    <span className={remainingClassName}>{budget.remaining_amount.formatted}</span>
                    <p className="text-xs text-muted-foreground">
                        Disponível no mês:{' '}
                        <span className="font-medium text-foreground">
                            {new Intl.NumberFormat('pt-BR', {
                                style: 'currency',
                                currency: budget.currency,
                            }).format(availableAmount / 100)}
                        </span>
                    </p>
                </div>
            </TableCell>
        </TableRow>
    );
};
