"use client";

import { useId, useMemo } from 'react';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

import {
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from '@/components/ui/chart';

type CategoryMonthlyChartProps = {
    data: App.Http.Resources.CategoryMonthlyTotalResource[];
    currency: App.Enums.Currency;
};

export const CategoryMonthlyChart = ({ data, currency }: CategoryMonthlyChartProps) => {
    const chartData = useMemo(() => data.map((item) => {
        const date = new Date(item.month);
        const label = new Intl.DateTimeFormat('pt-BR', { month: 'short' }).format(date);

        return {
            month: label.charAt(0).toUpperCase() + label.slice(1),
            debits: item.debits.value / 100,
            credits: item.credits.value / 100,
        };
    }), [data]);

    const hasData = chartData.some((item) => item.debits > 0 || item.credits > 0);

    const id = useId();

    const chartConfig: ChartConfig = {
        debits: {
            label: 'Saídas',
            color: 'var(--chart-1)',
        },
        credits: {
            label: 'Entradas',
            color: 'var(--chart-2)',
        },
    };

    const formatCurrency = (value: number) =>
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency }).format(value);

    if (!hasData) {
        return (
            <div className="flex h-full items-center justify-center rounded-md border border-dashed p-6 text-sm text-muted-foreground">
                Nenhum movimento para esta categoria nos últimos meses.
            </div>
        );
    }

    return (
        <ChartContainer config={chartConfig} className="aspect-[4/3] w-full">
            <AreaChart data={chartData}>
                <defs>
                    <linearGradient id={`debits-gradient-${id}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-debits)" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="var(--color-debits)" stopOpacity={0.05} />
                    </linearGradient>
                    <linearGradient id={`credits-gradient-${id}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-credits)" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="var(--color-credits)" stopOpacity={0.05} />
                    </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="6 6" />
                <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                />
                <ChartTooltip
                    cursor={false}
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
                <Area
                    type="monotone"
                    dataKey="debits"
                    stroke="var(--color-debits)"
                    fill={`url(#debits-gradient-${id})`}
                    strokeWidth={2}
                    name="Saídas"
                />
                <Area
                    type="monotone"
                    dataKey="credits"
                    stroke="var(--color-credits)"
                    fill={`url(#credits-gradient-${id})`}
                    strokeWidth={2}
                    name="Entradas"
                />
            </AreaChart>
        </ChartContainer>
    );
};
