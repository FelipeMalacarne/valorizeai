"use client";

import { useMemo } from 'react';
import { Bar, CartesianGrid, ComposedChart, Line, XAxis, YAxis } from 'recharts';
import { format, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import {
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from '@/components/ui/chart';

type MonthlyTrendChartProps = {
    data: App.Http.Resources.DashboardMonthlyTrendResource[];
    currency: App.Enums.Currency;
};

export const MonthlyTrendChart = ({ data, currency }: MonthlyTrendChartProps) => {
    const chartData = useMemo(
        () =>
            data.map((item) => {
                const date = parse(item.month, 'yyyy-MM-dd', new Date());
                const label = format(date, 'MMM', { locale: ptBR });
                return {
                    month: label.charAt(0).toUpperCase() + label.slice(1),
                    income: item.income.value / 100,
                    expense: item.expense.value / 100,
                    profit: item.profit.value / 100,
                };
            }),
        [data],
    );

    const hasData = chartData.some((point) => point.income > 0 || point.expense > 0 || point.profit !== 0);

    const chartConfig: ChartConfig = {
        income: {
            label: 'Entradas',
            color: 'var(--chart-2)',
        },
        expense: {
            label: 'Saídas',
            color: 'var(--chart-1)',
        },
        profit: {
            label: 'Resultado',
            color: 'var(--chart-5)',
        },
    };

    const formatCurrency = (value: number) =>
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency }).format(value);

    if (!hasData) {
        return (
            <div className="flex h-full items-center justify-center rounded-md border border-dashed p-6 text-sm text-muted-foreground">
                Sem dados suficientes para o período selecionado.
            </div>
        );
    }

    return (
        <ChartContainer config={chartConfig} className="aspect-[4/3] w-full">
            <ComposedChart data={chartData}>
                <CartesianGrid strokeDasharray="6 6" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis tickLine={false} axisLine={false} tickFormatter={formatCurrency} width={80} />
                <ChartTooltip
                    content={<ChartTooltipContent formatter={(value) => formatCurrency(value as number)} />}
                />
                <ChartLegend content={<ChartLegendContent />} className="justify-start pb-2" />
                <Bar dataKey="income" fill="var(--color-income)" radius={[6, 6, 0, 0]} name="Entradas" />
                <Bar dataKey="expense" fill="var(--color-expense)" radius={[6, 6, 0, 0]} name="Saídas" />
                <Line
                    type="monotone"
                    dataKey="profit"
                    stroke="var(--color-profit)"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                    name="Resultado"
                />
            </ComposedChart>
        </ChartContainer>
    );
};
