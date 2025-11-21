import { ImportStatusBadge } from '@/components/import-status-badge';
import { ImportTransactionsForm } from '@/components/import-transactions-form';
import { ResponsiveDialog } from '@/components/responsive-dialog';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { BreadcrumbItem, PaginatedResource, SharedData } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Search, Upload, Waypoints } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export type ImportsIndexProps = {
    imports: PaginatedResource<App.Http.Resources.ImportResource>;
    filters: App.Http.Requests.Import.IndexImportRequest;
};

const statusOptions: { label: string; value: App.Enums.ImportStatus }[] = [
    { label: 'Processando', value: 'processing' },
    { label: 'Pendente de revisão', value: 'pending_review' },
    { label: 'Aprovado', value: 'approved' },
    { label: 'Recusado', value: 'refused' },
    { label: 'Concluído', value: 'completed' },
    { label: 'Falhou', value: 'failed' },
];

const ImportsIndex = (props: SharedData<ImportsIndexProps>) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState(props.filters?.search ?? '');
    const [status, setStatus] = useState<App.Enums.ImportStatus | null>(props.filters?.status ?? null);
    const isFirstRender = useRef(true);

    useEffect(() => {
        setSearchTerm(props.filters?.search ?? '');
        setStatus(props.filters?.status ?? null);
    }, [props.filters]);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const timeout = setTimeout(() => {
            router.get(
                route('imports.index'),
                {
                    search: searchTerm || undefined,
                    status: status || undefined,
                    page: 1,
                },
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                    only: ['imports'],
                },
            );
        }, 200);

        return () => clearTimeout(timeout);
    }, [searchTerm, status]);

    const hasPendingImports = useMemo(() => props.imports.data.some((importItem) => importItem.pending_transactions > 0), [props.imports.data]);

    const handleStatusChange = (value: string) => {
        setStatus(value === 'all' ? null : (value as App.Enums.ImportStatus));
    };

    const handlePagination = (url: string | null) => {
        if (!url) return;
        router.get(url, {}, { preserveState: true, preserveScroll: true, only: ['imports'] });
    };

    return (
        <>
            <Head title="Importações" />
            <div className="container mx-auto flex h-full flex-1 flex-col space-y-6 p-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">Importações</h1>
                        <p className="text-muted-foreground">Revise e aprove suas importações antes de criar transações.</p>
                    </div>
                    <Button onClick={() => setIsDialogOpen(true)}>
                        <Upload className="mr-2 h-4 w-4" />
                        Importar extratos
                    </Button>
                </div>

                {hasPendingImports && (
                    <Card className="border-yellow/40 bg-yellow/10">
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-2 text-yellow">
                                <Waypoints className="h-5 w-5" />
                                Importações pendentes
                            </CardTitle>
                            <CardDescription className="text-yellow/80">
                                Você possui importações aguardando revisão. Analise os lançamentos antes de adicioná-los às suas contas.
                            </CardDescription>
                        </CardHeader>
                    </Card>
                )}

                <Card>
                    <CardHeader>
                        <CardTitle>Histórico de importações</CardTitle>
                        <CardDescription>Filtre os arquivos importados e acompanhe o progresso de revisão.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-3">
                            <div className="space-y-2">
                                <Label htmlFor="search">Buscar</Label>
                                <div className="relative">
                                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        id="search"
                                        placeholder="Nome do arquivo ou conta"
                                        value={searchTerm}
                                        onChange={(event) => setSearchTerm(event.target.value)}
                                        className="pl-9"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2 md:col-span-1">
                                <Label htmlFor="status">Status</Label>
                                <Select value={status ?? 'all'} onValueChange={handleStatusChange}>
                                    <SelectTrigger id="status">
                                        <SelectValue placeholder="Todos os status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Todos os status</SelectItem>
                                        {statusOptions.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="overflow-hidden rounded-lg border">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/50">
                                        <TableHead>Arquivo</TableHead>
                                        <TableHead>Conta</TableHead>
                                        <TableHead className="text-center">Pendentes</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Criação</TableHead>
                                        <TableHead className="text-right">Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {props.imports.data.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={6} className="py-12 text-center text-muted-foreground">
                                                Nenhuma importação encontrada.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                    {props.imports.data.map((importItem) => (
                                        <TableRow key={importItem.id}>
                                            <TableCell>
                                                <div className="font-medium text-foreground">{importItem.file_name}</div>
                                                <div className="text-xs text-muted-foreground">
                                                    {new Date(importItem.created_at).toLocaleString()}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {importItem.account ? (
                                                    <div>
                                                        <div className="font-medium">{importItem.account.name}</div>
                                                        <div className="text-xs text-muted-foreground">{importItem.account.bank.name}</div>
                                                    </div>
                                                ) : (
                                                    <span className="text-muted-foreground">Conta identificada automaticamente</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <span className={cn('font-semibold', importItem.pending_transactions > 0 ? 'text-yellow' : 'text-muted-foreground')}>
                                                    {importItem.pending_transactions}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <ImportStatusBadge status={importItem.status} />
                                            </TableCell>
                                            <TableCell>
                                                {new Date(importItem.created_at).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button asChild size="sm" variant="outline">
                                                    <Link href={route('imports.show', importItem.id)} prefetch>
                                                        Revisar
                                                    </Link>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        {props.imports.last_page > 1 && (
                            <div className="flex items-center justify-between">
                                <Button variant="ghost" disabled={!props.imports.prev_page_url} onClick={() => handlePagination(props.imports.prev_page_url)}>
                                    Anterior
                                </Button>
                                <p className="text-sm text-muted-foreground">
                                    Página {props.imports.current_page} de {props.imports.last_page}
                                </p>
                                <Button variant="ghost" disabled={!props.imports.next_page_url} onClick={() => handlePagination(props.imports.next_page_url)}>
                                    Próxima
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <ResponsiveDialog
                title="Importar transações"
                description="Envie arquivos OFX ou CSV para revisar antes de criar as transações."
                isOpen={isDialogOpen}
                setIsOpen={setIsDialogOpen}
            >
                <ImportTransactionsForm onClose={() => setIsDialogOpen(false)} />
            </ResponsiveDialog>
        </>
    );
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Importações',
        href: route('imports.index'),
    },
];

ImportsIndex.layout = (page: React.ReactNode) => <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>;

export default ImportsIndex;
