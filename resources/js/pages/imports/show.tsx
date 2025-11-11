import { CategoryBadge } from '@/components/category-badge';
import { Combobox } from '@/components/combobox';
import { ImportStatusBadge } from '@/components/import-status-badge';
import { ImportTransactionStatusBadge } from '@/components/import-transaction-status-badge';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, PaginatedResource, SharedData } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ImportTransactionReviewDrawer } from './components/import-transaction-review-drawer';
import { cn } from '@/lib/utils';
import { ArrowLeft, Search } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Pie, PieChart, Cell } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';

export type ImportShowProps = {
    import: App.Http.Resources.ImportResource;
    transactions: PaginatedResource<App.Http.Resources.ImportTransactionResource>;
    categories: App.Http.Resources.CategoryResource[];
    accounts: App.Http.Resources.AccountResource[];
    filters: App.Http.Requests.Import.ImportTransactionIndexRequest;
};

const statusFilters: { value: 'all' | App.Enums.ImportTransactionStatus; label: string }[] = [
    { value: 'all', label: 'Todos' },
    { value: 'new', label: 'Novos' },
    { value: 'conflicted', label: 'Conflitos' },
    { value: 'matched', label: 'Conciliados' },
    { value: 'approved', label: 'Aprovados' },
    { value: 'rejected', label: 'Rejeitados' },
];

const typeFilters: { value: 'all' | App.Enums.TransactionType; label: string }[] = [
    { value: 'all', label: 'Todos os tipos' },
    { value: 'credit', label: 'Créditos' },
    { value: 'debit', label: 'Débitos' },
];

const ImportShow = (props: SharedData<ImportShowProps>) => {
    const [searchTerm, setSearchTerm] = useState(props.filters?.search ?? '');
    const [statusFilter, setStatusFilter] = useState<'all' | App.Enums.ImportTransactionStatus>(props.filters?.status ?? 'all');
    const [typeFilter, setTypeFilter] = useState<'all' | App.Enums.TransactionType>(props.filters?.type ?? 'all');
    const [selectedTransaction, setSelectedTransaction] = useState<App.Http.Resources.ImportTransactionResource | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedTransactions, setSelectedTransactions] = useState<string[]>([]);
    const [bulkCategory, setBulkCategory] = useState<string | null>(null);
    const [isBulkProcessing, setIsBulkProcessing] = useState(false);
    const searchInitialized = useRef(false);
    const canReview = Boolean(props.import.account);
    const [accountBannerActive, setAccountBannerActive] = useState(false);

    const {
        data: accountLinkData,
        setData: setAccountLinkData,
        patch: patchAccount,
        processing: accountLinkProcessing,
    } = useForm({
        account_id: props.import.account?.id ?? props.accounts[0]?.id ?? '',
    });

    useEffect(() => {
        setSearchTerm(props.filters?.search ?? '');
        setStatusFilter(props.filters?.status ?? 'all');
        setTypeFilter(props.filters?.type ?? 'all');
        setSelectedTransactions([]);
    }, [props.filters]);

    useEffect(() => {
        if (!isDrawerOpen) {
            setSelectedTransaction(null);
        }
    }, [isDrawerOpen]);

    useEffect(() => {
        if (!searchInitialized.current) {
            searchInitialized.current = true;
            return;
        }

        const timeout = setTimeout(() => {
            applyFilters({ search: searchTerm, page: 1 });
        }, 200);

        return () => clearTimeout(timeout);
    }, [searchTerm]);

    useEffect(() => {
        setSelectedTransactions((prev) => prev.filter((id) => props.transactions.data.some((transaction) => transaction.id === id)));
    }, [props.transactions.data]);

    useEffect(() => {
        if (!props.import.account && props.accounts.length > 0 && !accountLinkData.account_id) {
            setAccountLinkData('account_id', props.accounts[0].id);
        }
    }, [props.import.account, props.accounts, accountLinkData.account_id, setAccountLinkData]);

    useEffect(() => {
        if (!accountBannerActive) {
            return;
        }

        const timeout = setTimeout(() => setAccountBannerActive(false), 800);

        return () => clearTimeout(timeout);
    }, [accountBannerActive]);

    const applyFilters = ({
        search,
        status,
        type,
        page,
    }: {
        search?: string;
        status?: 'all' | App.Enums.ImportTransactionStatus;
        type?: 'all' | App.Enums.TransactionType;
        page?: number;
    }) => {
        const nextStatus = status ?? statusFilter;
        const nextType = type ?? typeFilter;
        const nextSearch = search ?? searchTerm;

        router.get(
            route('imports.show', props.import.id),
            {
                search: nextSearch || undefined,
                status: nextStatus === 'all' ? undefined : nextStatus,
                type: nextType === 'all' ? undefined : nextType,
                page: page ?? props.transactions.current_page,
            },
            {
                preserveScroll: true,
                preserveState: true,
                replace: true,
                only: ['transactions'],
            },
        );
    };

    const handleStatusChange = (value: string) => {
        const nextValue = value as 'all' | App.Enums.ImportTransactionStatus;
        setStatusFilter(nextValue);
        applyFilters({ status: nextValue, page: 1 });
    };

    const handleTypeChange = (value: string) => {
        const nextValue = value as 'all' | App.Enums.TransactionType;
        setTypeFilter(nextValue);
        applyFilters({ type: nextValue, page: 1 });
    };

    const openDrawer = (transaction: App.Http.Resources.ImportTransactionResource) => {
        if (!canReview) {
            setAccountBannerActive(true);
            return;
        }

        setSelectedTransaction(transaction);
        setIsDrawerOpen(true);
    };

    const statusCounts: Record<string, number> = {
        all: props.transactions.total,
        new: props.import.new_count,
        conflicted: props.import.conflicted_count,
        matched: props.import.matched_count,
        approved: props.import.approved_transactions,
        rejected: props.import.rejected_transactions,
    };

    const handlePagination = (url: string | null) => {
        if (!url) return;
        router.get(url, {}, { preserveScroll: true, preserveState: true, only: ['transactions'] });
        setSelectedTransactions([]);
    };

    const stats = [
        { label: 'Novos', value: props.import.new_count, tone: 'text-sky' },
        { label: 'Conciliados', value: props.import.matched_count, tone: 'text-blue' },
        { label: 'Conflitos', value: props.import.conflicted_count, tone: 'text-yellow' },
        { label: 'Aprovados', value: props.import.approved_transactions, tone: 'text-green' },
        { label: 'Rejeitados', value: props.import.rejected_transactions, tone: 'text-red' },
    ];

    const totalImportTransactions =
        props.import.new_count +
        props.import.matched_count +
        props.import.conflicted_count +
        props.import.approved_transactions +
        props.import.rejected_transactions;

    const reviewChartConfig: ChartConfig = {
        new: { label: 'Novos', color: 'var(--color-sky)' },
        matched: { label: 'Conciliadas', color: 'var(--color-blue)' },
        conflicted: { label: 'Conflitos', color: 'var(--color-peach)' },
        approved: { label: 'Aprovadas', color: 'var(--color-green)' },
        rejected: { label: 'Rejeitadas', color: 'var(--color-red)' },
    };

    const reviewChartData = useMemo(
        () =>
            [
                { key: 'new', label: 'Novos', value: props.import.new_count },
                { key: 'matched', label: 'Conciliadas', value: props.import.matched_count },
                { key: 'conflicted', label: 'Conflitos', value: props.import.conflicted_count },
                { key: 'approved', label: 'Aprovadas', value: props.import.approved_transactions },
                { key: 'rejected', label: 'Rejeitadas', value: props.import.rejected_transactions },
            ].filter((segment) => segment.value > 0),
        [
            props.import.new_count,
            props.import.matched_count,
            props.import.conflicted_count,
            props.import.approved_transactions,
            props.import.rejected_transactions,
        ],
    );

    const selectableTransactions = useMemo(
        () => props.transactions.data.filter((transaction) => transaction.status === 'new'),
        [props.transactions.data],
    );

    const selectableIds = selectableTransactions.map((transaction) => transaction.id);

    const allSelected = selectableIds.length > 0 && selectableIds.every((id) => selectedTransactions.includes(id));
    const partiallySelected = !allSelected && selectableIds.some((id) => selectedTransactions.includes(id));

    const toggleSelection = (transactionId: string, checked: boolean) => {
        setSelectedTransactions((prev) => {
            if (checked) {
                return [...new Set([...prev, transactionId])];
            }

            return prev.filter((id) => id !== transactionId);
        });
    };

    const toggleAllSelections = (checked: boolean | 'indeterminate') => {
        if (!selectableIds.length) {
            return;
        }

        if (checked) {
            setSelectedTransactions((prev) => [...new Set([...prev, ...selectableIds])]);
        } else {
            setSelectedTransactions((prev) => prev.filter((id) => !selectableIds.includes(id)));
        }
    };

    const handleBulkApprove = () => {
        if (!selectedTransactions.length) {
            return;
        }

        if (!canReview) {
            setAccountBannerActive(true);
            return;
        }

        setIsBulkProcessing(true);

        router.post(
            route('imports.transactions.bulk-approve', props.import.id),
            {
                transaction_ids: selectedTransactions,
                category_id: bulkCategory,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setSelectedTransactions([]);
                    setBulkCategory(null);
                },
                onFinish: () => setIsBulkProcessing(false),
                onError: () => setIsBulkProcessing(false),
            },
        );
    };

    const categoryItems = useMemo(
        () => props.categories.map((category) => ({ value: category.id, label: category.name })),
        [props.categories],
    );

    const handleAccountLink = () => {
        if (!accountLinkData.account_id || props.accounts.length === 0) {
            return;
        }

        patchAccount(route('imports.account.update', props.import.id), {
            preserveScroll: true,
            onSuccess: () => {
                setAccountBannerActive(false);
            },
        });
    };

    return (
        <>
            <Head title={`Importação • ${props.import.file_name}`} />
            <div className="container mx-auto flex h-full flex-1 flex-col space-y-6 p-4">
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <div className="flex items-center gap-3">
                                <Link href={route('imports.index')} className="text-sm text-muted-foreground hover:text-foreground" prefetch>
                                    <ArrowLeft className="mr-1 inline h-4 w-4" /> Voltar
                                </Link>
                                <ImportStatusBadge status={props.import.status} />
                            </div>
                            <h1 className="mt-2 text-2xl font-semibold">{props.import.file_name}</h1>
                            <p className="text-muted-foreground">Importado em {new Date(props.import.created_at).toLocaleString()}</p>
                        </div>
                    </div>

                    {!props.import.account && (
                        <Card className={cn('border-yellow/40 bg-yellow/10 transition ring-offset-2', accountBannerActive && 'ring-2 ring-yellow/60')}>
                            <CardContent className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
                                <div>
                                    <p className="font-semibold text-yellow">Esta importação não está vinculada a uma conta.</p>
                                    <p className="text-muted-foreground text-sm">
                                        Escolha uma conta para poder aprovar as transações importadas.
                                    </p>
                                </div>
                                <div className="flex w-full flex-col gap-2 md:w-auto md:flex-row md:items-center md:gap-3">
                                    <div className="md:w-64">
                                        <Combobox
                                            items={props.accounts.map((account) => ({ value: account.id, label: account.name }))}
                                            value={accountLinkData.account_id}
                                            onChange={(value) => setAccountLinkData('account_id', value || '')}
                                            placeholder="Selecione uma conta"
                                            noResultsText="Nenhuma conta encontrada."
                                            disabled={props.accounts.length === 0}
                                        />
                                    </div>
                                    <Button
                                        onClick={handleAccountLink}
                                        disabled={accountLinkProcessing || !accountLinkData.account_id || props.accounts.length === 0}
                                        className="md:self-start"
                                    >
                                        Vincular conta
                                    </Button>
                                </div>
                                {props.accounts.length === 0 && (
                                    <p className="text-sm text-destructive">
                                        Você não possui contas disponíveis. Crie uma nova conta antes de continuar.
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {props.import.status === 'pending_review' && props.import.account && (
                        <Alert className="border-yellow/40 bg-yellow/10">
                            <AlertTitle>Pendências encontradas</AlertTitle>
                            <AlertDescription>
                                Existem transações aguardando aprovação. Revise os lançamentos abaixo para concluir esta importação.
                            </AlertDescription>
                        </Alert>
                    )}
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Resumo da importação</CardTitle>
                        <CardDescription>Estatísticas do arquivo e da conta vinculada.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 items-start">
                            <div className="space-y-2">
                                <h3 className="text-sm font-medium text-muted-foreground">Conta</h3>
                                {props.import.account ? (
                                    <div>
                                        <p className="text-lg font-semibold">{props.import.account.name}</p>
                                        <p className="text-sm text-muted-foreground">{props.import.account.bank.name}</p>
                                    </div>
                                ) : (
                                    <p className="text-muted-foreground">Conta identificada automaticamente.</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-sm font-medium text-muted-foreground">Estatísticas</h3>
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    {stats.map((stat) => (
                                        <div key={stat.label} className="rounded-lg border p-3">
                                            <p className="text-muted-foreground text-xs uppercase tracking-wide">{stat.label}</p>
                                            <p className={cn('text-lg font-semibold', stat.tone)}>{stat.value}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-medium text-muted-foreground">Distribuição</h3>
                                    <span className="text-xs text-muted-foreground">{totalImportTransactions} itens</span>
                                </div>
                                {reviewChartData.length ? (
                                    <ChartContainer config={reviewChartConfig} className="mx-auto aspect-square w-full max-w-[220px]">
                                        <PieChart>
                                            <Pie
                                                data={reviewChartData}
                                                dataKey="value"
                                                nameKey="label"
                                                innerRadius={45}
                                                outerRadius={80}
                                                paddingAngle={2}
                                                strokeWidth={0}
                                            >
                                                {reviewChartData.map((segment) => (
                                                    <Cell key={segment.key} fill={`var(--color-${segment.key})`} />
                                                ))}
                                            </Pie>
                                            <ChartTooltip
                                                content={
                                                    <ChartTooltipContent
                                                        labelFormatter={(label) => label}
                                                        formatter={(value, name) => [`${value}`, name as string]}
                                                    />
                                                }
                                            />
                                        </PieChart>
                                    </ChartContainer>
                                ) : (
                                    <div className="flex h-full min-h-[180px] items-center justify-center rounded-md border border-dashed text-xs text-muted-foreground">
                                        Sem transações suficientes para exibir o gráfico.
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Transações importadas</CardTitle>
                        <CardDescription>Use os filtros para focar nas transações que precisa revisar.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex flex-col gap-4">
                            <Tabs value={statusFilter} onValueChange={handleStatusChange} className="w-full">
                                <TabsList className="flex w-full flex-wrap gap-2">
                                    {statusFilters.map((filter) => (
                                        <TabsTrigger key={filter.value} value={filter.value} className="flex-1">
                                            <div className="flex w-full items-center justify-between text-xs sm:text-sm">
                                                <span>{filter.label}</span>
                                                <Badge variant="outline" className="ml-2 text-xs">
                                                    {statusCounts[filter.value] ?? 0}
                                                </Badge>
                                            </div>
                                        </TabsTrigger>
                                    ))}
                                </TabsList>
                            </Tabs>

                            <div className="grid gap-4 md:grid-cols-3">
                                <div className="space-y-2">
                                    <Label htmlFor="search">
                                        Busca
                                        <span className="ml-1 text-xs text-muted-foreground">(descrição ou FITID)</span>
                                    </Label>
                                    <div className="relative">
                                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            id="search"
                                            placeholder="Ex: supermercado"
                                            value={searchTerm}
                                            onChange={(event) => setSearchTerm(event.target.value)}
                                            className="pl-9"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="type">Tipo</Label>
                                    <Select value={typeFilter} onValueChange={handleTypeChange}>
                                        <SelectTrigger id="type">
                                            <SelectValue placeholder="Todos os tipos" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {typeFilters.map((filter) => (
                                                <SelectItem key={filter.value} value={filter.value}>
                                                    {filter.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-lg border">
                            {selectedTransactions.length > 0 && (
                                <div className="flex flex-col gap-3 border-b border-primary/20 bg-primary/5 p-3 text-sm md:flex-row md:items-center md:justify-between rounded-t-lg">
                                    <div>
                                        <p className="font-medium text-foreground">
                                            {selectedTransactions.length} transações selecionadas
                                        </p>
                                        <p className="text-muted-foreground text-xs">
                                            Apenas transações novas podem ser aprovadas em lote.
                                        </p>
                                    </div>
                                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-end md:gap-3 w-full md:w-auto">
                                        <div className="md:w-64">
                                            <Combobox
                                                items={categoryItems}
                                                value={bulkCategory}
                                                onChange={(value) => setBulkCategory(value || null)}
                                                placeholder="Categoria (opcional)"
                                                noResultsText="Nenhuma categoria encontrada."
                                            />
                                        </div>
                                        <Button
                                            onClick={handleBulkApprove}
                                            disabled={isBulkProcessing || selectedTransactions.length === 0 || !canReview}
                                            className="md:self-start"
                                        >
                                            Aprovar selecionadas
                                        </Button>
                                    </div>
                                </div>
                            )}
                            <div className="w-full overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-muted/50">
                                        <TableHead className="w-10">
                                            <Checkbox
                                                aria-label="Selecionar todas as transações novas desta página"
                                                checked={allSelected ? true : partiallySelected ? 'indeterminate' : false}
                                                disabled={selectableIds.length === 0}
                                                onCheckedChange={toggleAllSelections}
                                            />
                                        </TableHead>
                                        <TableHead>Data</TableHead>
                                        <TableHead className="w-[35%] !whitespace-normal">Descrição</TableHead>
                                        <TableHead>Valor</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Categoria</TableHead>
                                        <TableHead className="text-right">Ações</TableHead>
                                    </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                    {props.transactions.data.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={7} className="py-12 text-center text-muted-foreground">
                                                Nenhuma transação encontrada para os filtros selecionados.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                    {props.transactions.data.map((transaction) => {
                                        const isSelectable = transaction.status === 'new';
                                        const isChecked = selectedTransactions.includes(transaction.id);
                                        const isActionable = transaction.status === 'new' || transaction.status === 'conflicted';
                                        const isAutoMatched = transaction.status === 'matched' && transaction.matched_transaction;

                                        return (
                                            <TableRow key={transaction.id} className={cn(!isSelectable ? 'opacity-90' : undefined)}>
                                                <TableCell>
                                                    <Checkbox
                                                        aria-label={`Selecionar transação ${transaction.memo}`}
                                                        disabled={!isSelectable}
                                                        checked={isChecked}
                                                        onCheckedChange={(checked) =>
                                                            toggleSelection(transaction.id, Boolean(checked))
                                                        }
                                                    />
                                                </TableCell>
                                                <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                                                <TableCell className="align-top !whitespace-normal">
                                                    <div className="font-medium text-foreground break-words">{transaction.memo}</div>
                                                    {transaction.fitid && <div className="font-mono text-xs text-muted-foreground break-all">{transaction.fitid}</div>}
                                                </TableCell>
                                            <TableCell>
                                                <span className={cn('font-semibold', transaction.type === 'credit' ? 'text-green' : 'text-destructive')}>
                                                    {transaction.amount_formatted}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                {isAutoMatched ? (
                                                    <TooltipProvider delayDuration={200}>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <span>
                                                                    <ImportTransactionStatusBadge status={transaction.status} />
                                                                </span>
                                                            </TooltipTrigger>
                                                            <TooltipContent className="max-w-xs text-xs">
                                                                Conciliada com{' '}
                                                                {transaction.matched_transaction?.memo
                                                                    ? `"${transaction.matched_transaction.memo}"`
                                                                    : 'uma transação existente'}{' '}
                                                                em {new Date(transaction.matched_transaction.date).toLocaleDateString()}.
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                ) : (
                                                    <ImportTransactionStatusBadge status={transaction.status} />
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {transaction.category ? (
                                                    <CategoryBadge category={transaction.category} />
                                                ) : (
                                                    <Badge variant="secondary">Sem categoria</Badge>
                                                )}
                                            </TableCell>
                                                <TableCell className="text-right">
                                                    {isActionable ? (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => openDrawer(transaction)}
                                                            disabled={!canReview}
                                                        >
                                                            Revisar
                                                        </Button>
                                                    ) : transaction.matched_transaction ? (
                                                        <Button variant="ghost" size="sm" asChild>
                                                            <Link href={route('transactions.show', transaction.matched_transaction.id)} prefetch>
                                                                Ver transação
                                                            </Link>
                                                        </Button>
                                                    ) : (
                                                        <Button variant="ghost" size="sm" disabled>
                                                            Conciliada
                                                        </Button>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>

                        {props.transactions.last_page > 1 && (
                            <div className="flex items-center justify-between">
                                <Button variant="ghost" disabled={!props.transactions.prev_page_url} onClick={() => handlePagination(props.transactions.prev_page_url)}>
                                    Anterior
                                </Button>
                                <p className="text-sm text-muted-foreground">
                                    Página {props.transactions.current_page} de {props.transactions.last_page}
                                </p>
                                <Button variant="ghost" disabled={!props.transactions.next_page_url} onClick={() => handlePagination(props.transactions.next_page_url)}>
                                    Próxima
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <ImportTransactionReviewDrawer
                importId={props.import.id}
                transaction={selectedTransaction}
                categories={props.categories}
                isOpen={isDrawerOpen}
                onOpenChange={setIsDrawerOpen}
            />
        </>
    );
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Importações',
        href: route('imports.index'),
    },
    {
        title: 'Detalhes',
        href: '#',
    },
];

ImportShow.layout = (page: React.ReactNode) => <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>;

export default ImportShow;
