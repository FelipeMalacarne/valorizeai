"use client"

import * as React from "react"
import { Pie, PieChart, Cell, Sector } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartConfig
} from "@/components/ui/chart"
import { PieSectorDataItem } from "recharts/types/polar/Pie"

export type SpendingSummaryData = {
    category: string;
    amount: number;
    color: string;
};

type SpendingChartProps = {
    data: SpendingSummaryData[];
};

export function SpendingChart({ data }: SpendingChartProps) {
  const [activeIndex, setActiveIndex] = React.useState<number | undefined>(undefined)

  const chartConfig = React.useMemo(() => {
    if (!data) return {}
    return data.reduce((acc, item) => {
        acc[item.category] = {
            label: item.category,
            color: `var(--${item.color})`
        };
        return acc;
    }, { amount: { label: "Valor (R$)" } } as ChartConfig)
  }, [data]);

  if (data.length === 0) {
    return <div className="text-center text-muted-foreground py-8">Nenhum gasto este mês.</div>
  }

  return (
    <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square max-h-[250px]"
    >
        <PieChart>
            <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
            />
            <Pie
                data={data}
                dataKey="amount"
                nameKey={"category"}
                innerRadius={60}
                activeIndex={activeIndex}
                activeShape={({ outerRadius = 0, ...props }: PieSectorDataItem) => (
                    <Sector {...props} outerRadius={outerRadius + 10} />
                )}
                onMouseLeave={() => setActiveIndex(undefined)}
                onMouseEnter={(_, index) => setActiveIndex(index)}
            >
                {data.map((entry) => (
                    <Cell key={`cell-${entry.category}`} fill={chartConfig[entry.category as keyof typeof chartConfig]?.color} />
                ))}
            </Pie>
            <ChartLegend
              content={<ChartLegendContent nameKey="category" onMouseEnter={(item) => setActiveIndex(data.findIndex(d => d.category === item.payload.category))} onMouseLeave={() => setActiveIndex(undefined)} />}
              className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
            />
          </PieChart>
    </ChartContainer>
  )
}
