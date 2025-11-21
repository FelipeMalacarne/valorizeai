import { Combobox } from '@/components/combobox';
import { ImportTransactionStatusBadge } from '@/components/import-transaction-status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { router, useForm } from '@inertiajs/react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ImportTransactionReviewDrawerProps {
    importId: string;
    transaction: App.Http.Resources.ImportTransactionResource | null;
    categories: App.Http.Resources.CategoryResource[];
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export const ImportTransactionReviewDrawer = ({ importId, transaction, categories, isOpen, onOpenChange }: ImportTransactionReviewDrawerProps) => {
    const canReview = transaction ? ['new', 'conflicted'].includes(transaction.status) : false;

    const { data, setData, processing, reset, post } = useForm({
        category_id: transaction?.category?.id ?? null,
        replace_existing: false,
    });
    const [isRejecting, setIsRejecting] = useState(false);

    useEffect(() => {
        if (transaction) {
            setData({
                category_id: transaction.category?.id ?? null,
                replace_existing: false,
            });
        } else {
            reset();
        }
    }, [transaction, reset, setData]);

    const handleApprove = () => {
        if (!transaction) return;
        post(route('imports.transactions.approve', [importId, transaction.id]), {
            preserveScroll: true,
            onSuccess: () => {
                onOpenChange(false);
            },
        });
    };

    const handleReject = () => {
        if (!transaction) return;
        setIsRejecting(true);
        router.post(
            route('imports.transactions.reject', [importId, transaction.id]),
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    onOpenChange(false);
                },
                onFinish: () => setIsRejecting(false),
                onError: () => setIsRejecting(false),
            },
        );
    };

    const categoryItems = categories.map((category) => ({ value: category.id, label: category.name }));

    return (
        <Sheet open={isOpen} onOpenChange={onOpenChange}>
            <SheetContent className="w-full overflow-y-auto sm:max-w-lg p-4">
                <SheetHeader className="space-y-2">
                    <SheetTitle className="flex items-center justify-between gap-4">
                        <span>Revisar transação</span>
                        {transaction && <ImportTransactionStatusBadge status={transaction.status} />}
                    </SheetTitle>
                    <SheetDescription>
                        Analise as informações abaixo e decida se este lançamento deve ser aprovado ou rejeitado.
                    </SheetDescription>
                </SheetHeader>

                {!transaction ? (
                    <div className="mt-6 text-center text-muted-foreground">Selecione uma transação para revisar.</div>
                ) : (
                    <div className="mt-6 space-y-6">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-base">Detalhes da transação</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm">
                                <div className="space-y-1">
                                    <span className="text-muted-foreground">Descrição</span>
                                    <p className="font-medium text-foreground break-words text-sm leading-relaxed">
                                        {transaction.memo || '-'}
                                    </p>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Valor</span>
                                    <span className={cn('font-semibold', transaction.type === 'credit' ? 'text-green' : 'text-destructive')}>
                                        {transaction.amount_formatted}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Data</span>
                                    <span>{new Date(transaction.date).toLocaleDateString()}</span>
                                </div>
                                {transaction.fitid && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">FITID</span>
                                        <span className="font-mono text-xs text-muted-foreground">{transaction.fitid}</span>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {transaction.matched_transaction && (
                            <Card className="border-yellow/40 bg-yellow/10">
                                <CardHeader className="pb-2">
                                    <CardTitle className="flex items-center gap-2 text-sm text-yellow">
                                        <AlertTriangle className="h-4 w-4" />
                                        Existe uma transação semelhante
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-1 text-sm text-yellow">
                                    <div className="flex items-center justify-between">
                                        <span>Valor atual</span>
                                        <span>{transaction.matched_transaction.amount_formatted}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span>Data</span>
                                        <span>{new Date(transaction.matched_transaction.date).toLocaleDateString()}</span>
                                    </div>
                                    {transaction.matched_transaction.memo && (
                                        <div>
                                            <span className="text-xs uppercase tracking-wide text-yellow/80">Descrição</span>
                                            <p className="text-sm">{transaction.matched_transaction.memo}</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}

                        <div className="space-y-2">
                            <Label>Categoria</Label>
                            <Combobox
                                items={categoryItems}
                                value={data.category_id}
                                onChange={(value) => setData('category_id', value || null)}
                                placeholder="Selecione uma categoria"
                                noResultsText="Nenhuma categoria encontrada"
                            />
                        </div>

                        {transaction.status === 'conflicted' && transaction.matched_transaction && (
                            <div className="flex items-center space-x-2 rounded-lg border border-yellow/40 bg-yellow/10 p-3">
                                <Checkbox
                                    id="replace_existing"
                                    checked={data.replace_existing}
                                    onCheckedChange={(checked) => setData('replace_existing', Boolean(checked))}
                                />
                                <div className="space-y-1">
                                    <Label htmlFor="replace_existing" className="text-yellow">
                                        Substituir transação existente
                                    </Label>
                                    <p className="text-xs text-yellow/80">
                                        Atualiza a transação já registrada com os dados importados.
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="grid gap-2">
                            <Button onClick={handleApprove} disabled={!canReview || processing || isRejecting}>
                                <CheckCircle2 className="mr-2 h-4 w-4" /> Aprovar e criar transação
                            </Button>
                            <Button variant="outline" onClick={handleReject} disabled={!canReview || processing || isRejecting}>
                                Rejeitar
                            </Button>
                        </div>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
};
