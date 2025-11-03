import { ArrowDownCircle, ArrowUpCircle, Wallet } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type CategorySummaryCardsProps = {
    insights: App.Http.Resources.CategoryInsightsResource;
};

export const CategorySummaryCards = ({ insights }: CategorySummaryCardsProps) => {
    const netValue = insights.net_total.value;

    const summary: Array<{
        title: string;
        description: string;
        value: string;
        icon: React.ReactNode;
        tone?: 'positive' | 'negative';
    }> = [
        {
            title: 'Total de Saídas',
            description: 'Soma de todos os débitos atribuídos a esta categoria.',
            value: insights.total_debits.formatted,
            icon: <ArrowDownCircle className="h-5 w-5 text-rose-500" />,
            tone: 'negative',
        },
        {
            title: 'Total de Entradas',
            description: 'Créditos que utilizam esta categoria.',
            value: insights.total_credits.formatted,
            icon: <ArrowUpCircle className="h-5 w-5 text-emerald-500" />,
            tone: 'positive',
        },
        {
            title: 'Saldo líquido',
            description: 'Entradas menos saídas registradas.',
            value: insights.net_total.formatted,
            icon: <Wallet className={cn('h-5 w-5', netValue >= 0 ? 'text-emerald-500' : 'text-rose-500')} />,
            tone: netValue >= 0 ? 'positive' : 'negative',
        },
    ];

    return (
        <div className="grid gap-4 md:grid-cols-3">
            {summary.map((item) => (
                <Card key={item.title}>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardDescription>{item.title}</CardDescription>
                            {item.icon}
                        </div>
                        <CardTitle
                            className={cn(
                                'text-3xl font-semibold tracking-tight',
                                item.tone === 'positive' && 'text-emerald-500',
                                item.tone === 'negative' && 'text-rose-500',
                            )}
                        >
                            {item.value}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};
