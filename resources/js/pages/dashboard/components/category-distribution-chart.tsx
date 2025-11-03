"use client";

"use client";

import { useMemo, useState } from 'react';
import { Cell, Pie, PieChart, Sector } from 'recharts';

import {
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from '@/components/ui/chart';

type CategoryDistributionChartProps = {
    items: App.Http.Resources.DashboardCategoryShareResource[];
    currency: App.Enums.Currency;
};

export const CategoryDistributionChart = ({ items, currency }: CategoryDistributionChartProps) => {
    const chartData = useMemo(() => items.map((item, index) => ({
        name: item.category.name,
        value: item.total.value / 100,
        percentage: item.percentage,
        colorToken: `chart-${(index % 5) + 1}`,
    })), [items]);

    const hasData = chartData.some((item) => item.value > 0);

    const chartConfig: ChartConfig = chartData.reduce(
        (acc, item) => {
            acc[item.name] = {
                label: item.name,
                color: `var(--${item.colorToken})`,
            };
            return acc;
        },
        {} as ChartConfig,
    );

    const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);

    const formatCurrency = (value: number) =>
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency }).format(value);

    if (chartData.length === 0 || !hasData) {
        return (
            <div className="flex h-full items-center justify-center rounded-md border border-dashed p-6 text-sm text-muted-foreground">
                Nenhum gasto categorizado disponível.
            </div>
        );
    }

    return (
        <div className="flex w-full flex-col items-center">
            <ChartContainer config={chartConfig} className="aspect-square w-full max-w-[340px]">
                <PieChart>
                    <ChartTooltip
                        cursor={false}
                        content={
                            <ChartTooltipContent
                                formatter={(value, _name, item) => {
                                    const payload = item && 'payload' in item ? item.payload as typeof chartData[number] : undefined;

                                    return (
                                        <div className="flex flex-col">
                                            <span className="font-medium">{formatCurrency(value as number)}</span>
                                            {payload ? (
                                                <span className="text-muted-foreground text-xs">{payload.percentage}%</span>
                                            ) : null}
                                        </div>
                                    );
                                }}
                            />
                        }
                    />
                    <Pie
                        data={chartData}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={60}
                        activeIndex={activeIndex}
                        activeShape={(props) => <Sector {...props} outerRadius={(props.outerRadius ?? 0) + 10} />}
                        onMouseEnter={(_, index) => setActiveIndex(index)}
                        onMouseLeave={() => setActiveIndex(undefined)}
                    >
                        {chartData.map((entry) => (
                            <Cell key={entry.name} fill={chartConfig[entry.name]?.color} />
                        ))}
                    </Pie>
                    <ChartLegend
                        content={<ChartLegendContent nameKey="name" />}
                        className="flex flex-wrap justify-center gap-2 pt-2 text-xs"
                    />
                </PieChart>
            </ChartContainer>
        </div>
    );
};
