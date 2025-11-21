import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, router } from '@inertiajs/react';
import { SummaryCards } from './dashboard/components/summary-cards';
import { MonthlyTrendChart } from './dashboard/components/monthly-trend-chart';
import { CategoryDistributionChart } from './dashboard/components/category-distribution-chart';
import { AccountsOverview } from './dashboard/components/accounts-overview';
import { RecentActivity } from './dashboard/components/recent-activity';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { addMonths, format, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

type DashboardProps = SharedData<{
    summary: App.Http.Resources.DashboardSummaryResource;
    monthly_trend: App.Http.Resources.DashboardMonthlyTrendResource[];
    category_spending: App.Http.Resources.DashboardCategoryShareResource[];
    accounts: App.Http.Resources.AccountResource[];
    recent_transactions: App.Http.Resources.TransactionResource[];
    month_options: App.Http.Resources.DashboardMonthOption[];
    selected_month: string;
}>;

export default function Dashboard(props: DashboardProps) {
    const monthDate = useMemo(() => parse(`${props.selected_month}-01`, 'yyyy-MM-dd', new Date()), [props.selected_month]);

    const formattedMonth = useMemo(() => {
        const label = format(monthDate, 'MMMM yyyy', { locale: ptBR });
        return label.charAt(0).toUpperCase() + label.slice(1);
    }, [monthDate]);

    const changeMonth = (offset: number) => {
        const target = addMonths(monthDate, offset);
        router.get(
            route('dashboard'),
            { month: format(target, 'yyyy-MM') },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="container mx-auto flex h-full flex-1 flex-col gap-6 p-4">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <h1 className="text-2xl font-semibold">Visão geral</h1>
                        <p className="text-sm text-muted-foreground">Acompanhe seus gastos e entradas de forma consolidada.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" onClick={() => changeMonth(-1)} aria-label="Mês anterior">
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <div className="min-w-[150px] rounded-full border px-4 py-1 text-center text-sm font-medium">
                            {formattedMonth}
                        </div>
                        <Button variant="outline" size="icon" onClick={() => changeMonth(1)} aria-label="Próximo mês">
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <SummaryCards summary={props.summary} />

                <div className="grid gap-4 xl:grid-cols-3">
                    <Card className="xl:col-span-2">
                        <CardHeader>
                            <CardTitle>Fluxo mensal</CardTitle>
                            <CardDescription>Entradas, saídas e lucro nos últimos 6 meses.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <MonthlyTrendChart data={props.monthly_trend} currency={props.summary.total_balance.currency} />
                        </CardContent>
                    </Card>
                    <Card >
                        <CardHeader >
                            <CardTitle>Distribuição por categoria</CardTitle>
                            <CardDescription>Onde você mais gastou no mês.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <CategoryDistributionChart
                                items={props.category_spending}
                                currency={props.summary.total_balance.currency}
                            />
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                    <AccountsOverview accounts={props.accounts} />
                    <RecentActivity transactions={props.recent_transactions} />
                </div>
            </div>
        </AppLayout>
    );
}
