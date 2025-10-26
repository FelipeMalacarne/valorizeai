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

const chartData = [
    { category: 'food', amount: 450.75 },
    { category: 'transport', amount: 120.50 },
    { category: 'leisure', amount: 250.00 },
    { category: 'housing', amount: 800.00 },
    { category: 'other', amount: 150.00 },
];

const chartConfig = {
  amount: {
    label: "Valor (R$)",
  },
  food: {
    label: "Alimentação",
    color: "var(--chart-1)",
  },
  transport: {
    label: "Transporte",
    color: "var(--chart-2)",
  },
  leisure: {
    label: "Lazer",
    color: "var(--chart-3)",
  },
  housing: {
    label: "Moradia",
    color: "var(--chart-4)",
  },
  other: {
    label: "Outros",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig

export function SpendingChart() {
  const [activeIndex, setActiveIndex] = React.useState<number | undefined>(undefined)

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
                data={chartData}
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
                {chartData.map((entry) => (
                    <Cell key={`cell-${entry.category}`} fill={chartConfig[entry.category as keyof typeof chartConfig].color} />
                ))}
            </Pie>
            <ChartLegend
              content={<ChartLegendContent nameKey="category" onMouseEnter={(item) => setActiveIndex(chartData.findIndex(d => d.category === item.payload.category))} onMouseLeave={() => setActiveIndex(undefined)} />}
              className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
            />
          </PieChart>
    </ChartContainer>
  )
}
