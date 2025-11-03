import { format } from 'date-fns';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

type RecentActivityProps = {
    transactions: App.Http.Resources.TransactionResource[];
};

export const RecentActivity = ({ transactions }: RecentActivityProps) => (
    <Card className="h-full">
        <CardHeader>
            <CardTitle>Atividade recente</CardTitle>
            <CardDescription>Últimas transações registradas.</CardDescription>
        </CardHeader>
        <CardContent className="px-0">
            <div className="overflow-x-auto">
            <Table className="min-w-[560px]">
                <TableHeader>
                    <TableRow>
                        <TableHead>Data</TableHead>
                        <TableHead>Descrição</TableHead>
                        <TableHead>Conta</TableHead>
                        <TableHead className="text-right">Valor</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {transactions.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                Nenhuma transação recente.
                            </TableCell>
                        </TableRow>
                    ) : (
                        transactions.map((transaction) => (
                            <TableRow key={transaction.id}>
                                <TableCell className="whitespace-nowrap text-sm">
                                    {format(new Date(transaction.date), "dd/MM/yyyy")}
                                </TableCell>
                                <TableCell className="max-w-[240px] text-sm">
                                    <div className="truncate text-foreground" title={transaction.memo ?? undefined}>
                                        {transaction.memo ?? 'Sem descrição'}
                                    </div>
                                </TableCell>
                                <TableCell className="text-sm">
                                    <Badge variant="outline" className="font-normal">
                                        {transaction.account.name}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right text-sm font-semibold">
                                    <span className={transaction.type === 'debit' ? 'text-rose-500' : 'text-emerald-500'}>
                                        {transaction.amount_formatted}
                                    </span>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
            </div>
        </CardContent>
    </Card>
);
