import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, router } from '@inertiajs/react';
import { SummaryCards } from './dashboard/components/summary-cards';
import { MonthlyTrendChart } from './dashboard/components/monthly-trend-chart';
import { CategoryDistributionChart } from './dashboard/components/category-distribution-chart';
import { AccountsOverview } from './dashboard/components/accounts-overview';
import { RecentActivity } from './dashboard/components/recent-activity';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

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
    const handleMonthChange = (value: string) => {
        router.get(route('dashboard'), { month: value }, { preserveState: true, preserveScroll: true });
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
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-3">
                        <Label htmlFor="dashboard-month" className="text-xs uppercase text-muted-foreground md:text-right">
                            Mês de referência
                        </Label>
                        <Select value={props.selected_month} onValueChange={handleMonthChange}>
                            <SelectTrigger id="dashboard-month" className="w-[200px]">
                                <SelectValue placeholder="Selecione um mês" />
                            </SelectTrigger>
                            <SelectContent>
                                {props.month_options.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
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
