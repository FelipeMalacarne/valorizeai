import React from 'react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

type BalanceCardProps = {
    title: string;
    amount?: App.ValueObjects.Money;
    description?: string;
    icon?: React.ReactNode;
    tone?: 'default' | 'positive' | 'negative';
    className?: string;
};

const toneStyles: Record<'default' | 'positive' | 'negative', { icon: string; amount: string }> = {
    default: {
        icon: 'bg-muted text-muted-foreground',
        amount: '',
    },
    positive: {
        icon: 'bg-emerald-100 text-emerald-600',
        amount: 'text-emerald-600',
    },
    negative: {
        icon: 'bg-rose-100 text-rose-600',
        amount: 'text-rose-500',
    },
};

export const BalanceCard = ({ title, amount, description, icon, tone = 'default', className }: BalanceCardProps) => {
    const styles = toneStyles[tone];

    return (
        <Card className={cn('shadow-sm', className)}>
            <CardHeader >
                <div className="flex items-center justify-between">
                    <CardDescription className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        {title}
                    </CardDescription>
                    {icon ? (
                        <span
                            className={cn(
                                'flex h-10 w-10 items-center justify-center rounded-full text-base',
                                styles.icon,
                            )}
                        >
                            {icon}
                        </span>
                    ) : null}
                </div>

                {amount ? (
                    <CardTitle className={cn('text-2xl font-semibold tracking-tight', styles.amount)}>
                        {amount.formatted}
                    </CardTitle>
                ) : (
                    <Skeleton className="h-8 w-28" />
                )}
            </CardHeader>

            {description ? (
                <CardContent>
                    <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
                </CardContent>
            ) : null}
        </Card>
    );
};
