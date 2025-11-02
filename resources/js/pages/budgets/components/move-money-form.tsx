import InputError from '@/components/input-error';
import { Combobox } from '@/components/combobox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useEffect, useMemo } from 'react';

type MoveMoneyFormProps = {
    budgets: App.Http.Resources.BudgetResource[];
    month: string;
    onClose: () => void;
};

export const MoveMoneyForm = ({ budgets, month, onClose }: MoveMoneyFormProps) => {
    const defaultCurrency = budgets[0]?.currency ?? 'BRL';

    const { data, setData, post, processing, errors, reset } = useForm({
        from_budget_id: '',
        to_budget_id: '',
        month,
        amount: {
            value: 0,
            currency: defaultCurrency,
        },
    });

    useEffect(() => {
        setData('month', month);
    }, [month]);

    const fromBudget = useMemo(() => budgets.find((budget) => budget.id === data.from_budget_id), [budgets, data.from_budget_id]);
    // const toBudget = useMemo(() => budgets.find((budget) => budget.id === data.to_budget_id), [budgets, data.to_budget_id]);

    useEffect(() => {
        if (fromBudget) {
            setData((previous) => ({
                ...previous,
                amount: {
                    ...previous.amount,
                    currency: fromBudget.currency,
                },
            }));
        }
    }, [fromBudget?.id]);

    const submit: FormEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault();

        post(route('budgets.move'), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const digitsOnly = event.target.value.replace(/\D/g, '');
        const integerValue = Number(digitsOnly);
        const normalizedValue = Number.isNaN(integerValue) ? 0 : integerValue;

        setData('amount', {
            ...data.amount,
            value: normalizedValue,
        });
    };

    const disabled = budgets.length < 2;

    return (
        <form className="space-y-4" onSubmit={submit}>
            <div className="space-y-2">
                <Label>Categoria de origem</Label>
                <Combobox
                    disabled={disabled}
                    value={data.from_budget_id}
                    onChange={(value) => setData('from_budget_id', value ?? '')}
                    placeholder={disabled ? 'Adicione mais categorias para mover valores' : 'Selecione a categoria de origem'}
                    items={budgets.map((budget) => ({
                        value: budget.id,
                        label: budget.category.name,
                        ...budget,
                    }))}
                />
                <InputError message={errors.from_budget_id} />
            </div>

            <div className="space-y-2">
                <Label>Categoria de destino</Label>
                <Combobox
                    disabled={disabled}
                    value={data.to_budget_id}
                    onChange={(value) => setData('to_budget_id', value ?? '')}
                    placeholder={disabled ? 'Adicione mais categorias para mover valores' : 'Selecione a categoria de destino'}
                    items={budgets.map((budget) => ({
                        value: budget.id,
                        label: budget.category.name,
                        ...budget,
                    }))}
                />
                <InputError message={errors.to_budget_id} />
            </div>

            <div className="space-y-2">
                <Label htmlFor="amount">Valor a mover</Label>
                <div className="flex items-center space-x-2">
                    <span className="text-muted-foreground text-sm font-medium">{data.amount.currency}</span>
                    <Input
                        id="amount"
                        disabled={processing || disabled}
                        value={(data.amount.value / 100).toFixed(2)}
                        onChange={handleAmountChange}
                        inputMode="decimal"
                        className="w-28"
                    />
                </div>
                <InputError message={errors['amount.value'] ?? errors.amount} />
            </div>

            <Button
                type="submit"
                className="w-full"
                disabled={
                    disabled ||
                    processing ||
                    !data.from_budget_id ||
                    !data.to_budget_id ||
                    data.from_budget_id === data.to_budget_id ||
                    data.amount.value <= 0
                }
            >
                Mover dinheiro
            </Button>
        </form>
    );
};
