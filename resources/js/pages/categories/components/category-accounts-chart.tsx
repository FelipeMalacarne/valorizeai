"use client";

import { useMemo } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

import {
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from '@/components/ui/chart';

type CategoryAccountsChartProps = {
    data: App.Http.Resources.CategoryAccountBreakdownResource[];
    currency: App.Enums.Currency;
};

export const CategoryAccountsChart = ({ data, currency }: CategoryAccountsChartProps) => {
    const chartData = useMemo(() => data.map((item) => ({
        account: item.account_name,
        debits: item.debits.value / 100,
        credits: item.credits.value / 100,
    })), [data]);

    const hasData = chartData.some((item) => item.debits > 0 || item.credits > 0);

    const chartConfig: ChartConfig = {
        debits: {
            label: 'Saídas',
            color: 'var(--chart-3)',
        },
        credits: {
            label: 'Entradas',
            color: 'var(--chart-4)',
        },
    };

    const formatCurrency = (value: number) =>
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency }).format(value);

    if (!hasData) {
        return (
            <div className="flex h-full items-center justify-center rounded-md border border-dashed p-6 text-sm text-muted-foreground">
                Ainda não há movimentações desta categoria nas suas contas.
            </div>
        );
    }

    return (
        <ChartContainer config={chartConfig} className="aspect-[4/3] w-full">
            <BarChart data={chartData}>
                <CartesianGrid vertical={false} strokeDasharray="6 6" />
                <XAxis
                    dataKey="account"
                    axisLine={false}
                    tickLine={false}
                    tickMargin={8}
                />
                <ChartTooltip
                    content={
                        <ChartTooltipContent
                            formatter={(value) => formatCurrency(value as number)}
                        />
                    }
                />
                <ChartLegend
                    content={<ChartLegendContent />}
                    className="justify-start pb-2"
                />
                <Bar
                    dataKey="debits"
                    name="Saídas"
                    radius={[6, 6, 0, 0]}
                    fill="var(--color-debits)"
                />
                <Bar
                    dataKey="credits"
                    name="Entradas"
                    radius={[6, 6, 0, 0]}
                    fill="var(--color-credits)"
                />
            </BarChart>
        </ChartContainer>
    );
};
