import { ArrowDownCircle, ArrowUpCircle, PiggyBank, Wallet } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type SummaryCardsProps = {
    summary: App.Http.Resources.DashboardSummaryResource;
};

const items = [
    {
        title: 'Saldo total',
        description: 'Saldo consolidado nas contas na moeda preferida.',
        key: 'total_balance' as const,
        icon: <Wallet className="h-5 w-5 text-primary" />,
    },
    {
        title: 'Entradas no mês',
        description: 'Créditos registrados no mês corrente.',
        key: 'monthly_income' as const,
        icon: <ArrowUpCircle className="h-5 w-5 text-emerald-500" />,
        tone: 'positive' as const,
    },
    {
        title: 'Saídas no mês',
        description: 'Débitos registrados no mês corrente.',
        key: 'monthly_expense' as const,
        icon: <ArrowDownCircle className="h-5 w-5 text-rose-500" />,
        tone: 'negative' as const,
    },
    {
        title: 'Resultado do mês',
        description: 'Entradas menos saídas registradas até agora.',
        key: 'monthly_profit' as const,
        icon: <PiggyBank className="h-5 w-5 text-violet-500" />,
        tone: 'balance' as const,
    },
] as const;

export const SummaryCards = ({ summary }: SummaryCardsProps) => (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {items.map((item) => {
            const money = summary[item.key];
            const toneClass = (() => {
                if (item.tone === 'positive') return 'text-emerald-500';
                if (item.tone === 'negative') return 'text-rose-500';
                if (item.tone === 'balance') return money.value >= 0 ? 'text-emerald-500' : 'text-rose-500';
                return '';
            })();

            return (
                <Card key={item.title}>
                    <CardHeader className="space-y-2 pb-3">
                        <div className="flex items-center justify-between">
                            <CardDescription>{item.title}</CardDescription>
                            {item.icon}
                        </div>
                        <CardTitle className={cn('text-3xl font-semibold tracking-tight', toneClass)}>
                            {money.formatted}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                    </CardContent>
                </Card>
            );
        })}
    </div>
);
