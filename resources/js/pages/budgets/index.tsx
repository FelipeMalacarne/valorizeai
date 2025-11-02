import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, SharedData } from '@/types';
import { Head, router } from '@inertiajs/react';
import { addMonths, format, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { type ReactNode, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChevronLeft, ChevronRight, Plus, Shuffle } from 'lucide-react';
import { ResponsiveDialog } from '@/components/responsive-dialog';
import { cn } from '@/lib/utils';
import { BudgetRow } from './components/budget-row';
import { CreateBudgetForm } from './components/create-budget-form';
import { MoveMoneyForm } from './components/move-money-form';

type BudgetsIndexProps = {
    filters: {
        month: string;
    };
    overview: App.Http.Resources.BudgetOverviewResource[];
    budgets: App.Http.Resources.BudgetResource[];
    categories: App.Http.Resources.CategoryResource[];
};

const BudgetsIndex = (props: SharedData<BudgetsIndexProps>) => {
    const overview = props.overview ?? [];
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isMoveDialogOpen, setIsMoveDialogOpen] = useState(false);

    const monthDate = useMemo(() => parse(`${props.filters.month}-01`, 'yyyy-MM-dd', new Date()), [props.filters.month]);

    const formattedMonth = useMemo(() => {
        const label = format(monthDate, 'MMMM yyyy', { locale: ptBR });
        return label.charAt(0).toUpperCase() + label.slice(1);
    }, [monthDate]);

    const changeMonth = (offset: number) => {
        const target = addMonths(monthDate, offset);
        router.get(
            route('budgets.index'),
            { month: format(target, 'yyyy-MM') },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };

    const totals = useMemo(() => {
        return overview.reduce(
            (accumulator, budget) => {
                accumulator.budgeted += budget.budgeted_amount.value;
                accumulator.spent += budget.spent_amount.value;
                accumulator.remaining += budget.remaining_amount.value;
                return accumulator;
            },
            { budgeted: 0, spent: 0, remaining: 0 },
        );
    }, [overview]);

    const currency = overview[0]?.currency ?? (props.auth.user as any)?.preferred_currency ?? 'BRL';
    const currencyFormatter = useMemo(
        () => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: currency as string }),
        [currency],
    );
    const formatCurrency = (amount: number) => currencyFormatter.format(amount / 100);

    const remainingTrend: SummaryTone =
        totals.remaining === 0 ? 'neutral' : totals.remaining > 0 ? 'positive' : 'negative';
    const spentShare = totals.budgeted === 0 ? 0 : Math.round((totals.spent / totals.budgeted) * 100);

    const availableCategories = useMemo(() => {
        const budgetCategoryIds = new Set(props.budgets.map((budget) => budget.category.id));
        return props.categories.filter((category) => !budgetCategoryIds.has(category.id));
    }, [props.budgets, props.categories]);

    return (
        <>
            <Head title="Orçamentos" />
            <div className="container mx-auto flex h-full flex-1 flex-col space-y-6 p-4">
                <Card>
                    <CardContent className="space-y-6 ">
                        <div className="flex flex-col gap-4 justify-between md:flex-row md:items-center">
                            <div className="space-y-1">
                                <h1 className="text-2xl font-semibold tracking-tight">Planejamento do mês</h1>
                                <p className="text-muted-foreground">
                                    Acompanhe seus envelopes, ajuste o que foi planejado e veja quanto ainda está disponível.
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => changeMonth(-1)}
                                    aria-label="Mês anterior"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <div className="min-w-[150px] rounded-full border px-4 py-1 text-center text-sm font-medium">
                                    {formattedMonth}
                                </div>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => changeMonth(1)}
                                    aria-label="Próximo mês"
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-3">
                            <SummaryStat
                                label="Orçado"
                                value={formatCurrency(totals.budgeted)}
                                helper={`Inclui ${overview.length} ${overview.length === 1 ? 'categoria' : 'categorias'}`}
                            />
                            <SummaryStat
                                label="Gasto"
                                tone="negative"
                                value={formatCurrency(totals.spent)}
                                helper={`${spentShare}% do valor planejado foi utilizado`}
                            />
                            <SummaryStat
                                label="Disponível"
                                tone={remainingTrend}
                                value={formatCurrency(totals.remaining)}
                                helper={
                                    totals.remaining >= 0
                                        ? 'Saldo pronto para ser utilizado'
                                        : 'Revise envelopes para cobrir o déficit'
                                }
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="space-y-1">
                            <CardTitle>Distribuição por categoria</CardTitle>
                            <CardDescription>Defina quanto destinar por envelope e acompanhe o uso em tempo real.</CardDescription>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            <Button
                                variant="outline"
                                onClick={() => setIsMoveDialogOpen(true)}
                                disabled={props.budgets.length < 2}
                            >
                                <Shuffle className="mr-2 h-4 w-4" />
                                <span>Mover dinheiro</span>
                            </Button>
                            <Button
                                onClick={() => setIsCreateDialogOpen(true)}
                                disabled={availableCategories.length === 0}
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                <span>Novo orçamento</span>
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent >
                        <div className="rounded-lg border border-border">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/40">
                                        <TableHead>Categoria</TableHead>
                                        <TableHead className="w-[220px]">Orçado</TableHead>
                                        <TableHead className="w-[220px] text-right">Gastos</TableHead>
                                        <TableHead className="w-[160px] text-right">Disponível</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {overview.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="py-14 text-center text-muted-foreground">
                                                Nenhum envelope configurado para este mês. Crie um orçamento para começar.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        overview.map((budget) => (
                                            <BudgetRow key={budget.id} budget={budget} month={props.filters.month} />
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-2 border-t bg-muted/20 p-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                        <span>Totais consideram o saldo trazido de meses anteriores.</span>
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 font-medium text-foreground">
                            <span>Orçado: {formatCurrency(totals.budgeted)}</span>
                            <span>Gasto: {formatCurrency(totals.spent)}</span>
                            <span
                                className={cn(
                                    remainingTrend === 'positive' && 'text-emerald-600',
                                    remainingTrend === 'negative' && 'text-destructive',
                                )}
                            >
                                Disponível: {formatCurrency(totals.remaining)}
                            </span>
                        </div>
                    </CardFooter>
                </Card>
            </div>

            <ResponsiveDialog
                isOpen={isCreateDialogOpen}
                setIsOpen={setIsCreateDialogOpen}
                title="Novo orçamento"
                description="Associe uma categoria a um envelope para começar a planejar seus gastos."
            >
                <CreateBudgetForm
                    categories={availableCategories}
                    onClose={() => setIsCreateDialogOpen(false)}
                />
            </ResponsiveDialog>

            <ResponsiveDialog
                isOpen={isMoveDialogOpen}
                setIsOpen={setIsMoveDialogOpen}
                title="Mover dinheiro entre categorias"
                description="Realocar valores ajuda a manter o orçamento alinhado às suas prioridades."
            >
                <MoveMoneyForm
                    budgets={props.budgets}
                    month={props.filters.month}
                    onClose={() => setIsMoveDialogOpen(false)}
                />
            </ResponsiveDialog>
        </>
    );
};

const SummaryStat = ({ label, value, helper, tone = 'neutral' }: SummaryStatProps) => (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <p
            className={cn(
                'mt-2 text-2xl font-semibold',
                tone === 'positive' && 'text-emerald-600',
                tone === 'negative' && 'text-destructive',
            )}
        >
            {value}
        </p>
        {helper && <p className="mt-2 text-xs text-muted-foreground">{helper}</p>}
    </div>
);

type SummaryTone = 'positive' | 'negative' | 'neutral';

type SummaryStatProps = {
    label: string;
    value: string;
    helper?: string;
    tone?: SummaryTone;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Orçamentos',
        href: route('budgets.index'),
    },
];

BudgetsIndex.layout = (page: ReactNode) => <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>;

export default BudgetsIndex;
