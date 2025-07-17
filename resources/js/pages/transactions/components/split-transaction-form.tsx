import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useMemo } from 'react';

export function SplitTransactionForm({ transaction }: { transaction: App.Http.Resources.TransactionResource }) {

    const allocatedAmount = useMemo(() => {
        return transaction.splits.reduce((total, split) => {
            return total + split.amount.value;
        }, 0);
    }, [transaction.splits]);

    return (
        <form className="space-y-6">
            <div className="bg-muted/50 rounded-lg p-4">
                <div className="mb-3 flex items-start justify-between">
                    <div>
                        <h3 className="font-semibold">{transaction.memo}</h3>
                        <p className="text-green text-2xl font-bold">{transaction.amount_formatted}</p>
                    </div>
                    <Badge variant="outline">{new Date(transaction.date).toLocaleDateString()}</Badge>
                </div>

                <Progress value={transaction.amount.value / allocatedAmount} />
            </div>
        </form>
    );
}
