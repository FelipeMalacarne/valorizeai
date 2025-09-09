import { CategoryBadge } from '@/components/category-badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { Clock, TrendingDown, TrendingUp } from 'lucide-react';

export function RecentTransactions({ transactions }: { transactions: App.Http.Resources.TransactionResource[] }) {
    return (
        <Card >
            <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                    <Clock className="h-5 w-5" />
                    <span>Ultimas Transações</span>
                </CardTitle>
                <CardDescription> Sua atividade financeira mais recente </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {transactions.length === 0 ? (
                        <div className="text-muted-foreground py-8 text-center">
                            <Clock className="mx-auto mb-2 h-8 w-8 opacity-50" />
                            <p>No transactions found</p>
                        </div>
                    ) : (
                        transactions.map((transaction) => (
                            <Link
                                key={transaction.id}
                                className=" cursor-pointer bg-card hover:bg-accent/50 flex items-center justify-between rounded-lg border p-3 transition-colors"
                                href={route('transactions.show', transaction.id)}
                            >
                                <div className="flex items-center space-x-3">
                                    <div className={cn('rounded-full p-2', transaction.type === 'debit' ? 'bg-destructive/10' : 'bg-primary/10')}>
                                        {transaction.type === 'debit' ? (
                                            <TrendingDown className="text-destructive h-4 w-4" />
                                        ) : (
                                            <TrendingUp className="text-primary h-4 w-4" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">{transaction.memo || 'No description'}</p>
                                        <div className="text-muted-foreground flex items-center space-x-2 text-xs">
                                            <span>{transaction.account.name}</span>
                                            {transaction.category && (
                                                <>
                                                    <span>•</span>
                                                    <CategoryBadge category={transaction.category} />
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className={cn('font-semibold', transaction.type === 'debit' ? 'text-destructive' : 'text-primary')}>
                                        {transaction.amount.formatted}
                                    </p>
                                    <p className="text-muted-foreground text-xs">{new Date(transaction.date).toLocaleDateString()}</p>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
