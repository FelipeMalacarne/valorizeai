import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export const BalanceCard = () => {
    const data = { balance: 2030.35, lastPeriodBalance: 1111.3 };
    // limit to 20 deicimal
    const percentageChange = (((data.balance - data.lastPeriodBalance) / data.lastPeriodBalance) * 100).toFixed(2);

    return (
        <Card>
            <CardHeader>
                <CardDescription>Balanço:</CardDescription>
                <CardTitle className="text-4xl">{data ? data.balance : <Skeleton className="h-6 w-24" />}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-muted-foreground text-xs">
                    {data ? <span>{percentageChange}% desde o ultimo periodo</span> : <Skeleton className="mt-1 h-4 w-16" />}
                </div>
            </CardContent>
        </Card>
    );
};
