import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, SharedData } from '@/types';
import { Head, router } from '@inertiajs/react';
import { addMonths, format, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { type ReactNode, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChevronLeft, ChevronRight, Plus, Shuffle } from 'lucide-react';
import { ResponsiveDialog } from '@/components/responsive-dialog';
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

    const availableCategories = useMemo(() => {
        const budgetCategoryIds = new Set(props.budgets.map((budget) => budget.category.id));
        return props.categories.filter((category) => !budgetCategoryIds.has(category.id));
    }, [props.budgets, props.categories]);

    return (
        <>
            <Head title="Orçamentos" />
            <div className="container mx-auto flex h-full flex-1 flex-col space-y-6 p-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Orçamentos</h1>
                        <p className="text-muted-foreground">
                            Acompanhe seus envelopes e mantenha seu planejamento em dia.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" onClick={() => changeMonth(-1)} aria-label="Mês anterior">
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span className="min-w-[140px] text-center font-medium">{formattedMonth}</span>
                        <Button variant="outline" size="icon" onClick={() => changeMonth(1)} aria-label="Próximo mês">
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                    <SummaryCard title="Orçado" value={currencyFormatter.format(totals.budgeted / 100)} />
                    <SummaryCard title="Gasto" value={currencyFormatter.format(totals.spent / 100)} />
                    <SummaryCard title="Disponível" value={currencyFormatter.format(totals.remaining / 100)} highlight={totals.remaining < 0} />
                </div>

                <Card>
                    <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="space-y-1.5">
                            <CardTitle>Planejamento mensal</CardTitle>
                            <CardDescription>Atualize os valores orçados e acompanhe os gastos por categoria.</CardDescription>
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
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Categoria</TableHead>
                                    <TableHead>Orçado</TableHead>
                                    <TableHead className="text-right">Gastos</TableHead>
                                    <TableHead className="text-right">Disponível</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {overview.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="py-10 text-center text-muted-foreground">
                                            Nenhum orçamento cadastrado para este mês. Crie um novo orçamento para
                                            começar.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    overview.map((budget) => (
                                        <BudgetRow key={budget.id} budget={budget} month={props.filters.month} />
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
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

const SummaryCard = ({ title, value, highlight = false }: SummaryCardProps) => (
    <Card>
        <CardHeader className="pb-2">
            <CardDescription>{title}</CardDescription>
            <CardTitle className={`text-2xl ${highlight ? 'text-destructive' : ''}`}>{value}</CardTitle>
        </CardHeader>
    </Card>
);

type SummaryCardProps = {
    title: string;
    value: string;
    highlight?: boolean;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Orçamentos',
        href: route('budgets.index'),
    },
];

BudgetsIndex.layout = (page: ReactNode) => <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>;

export default BudgetsIndex;
