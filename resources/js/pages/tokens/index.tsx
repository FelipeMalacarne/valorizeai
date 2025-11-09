import { InlineCode } from '@/components/inline-code-copy';
import InputError from '@/components/input-error';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, SharedData } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { format, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { AlertCircle, Check, Copy, MoreHorizontal, PlusCircle, Shield, ShieldCheck, ShieldOff } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { ResponsiveDialog } from '@/components/responsive-dialog';

type ExpirationPreset = {
    label: string;
    value: number | null;
};

type GeneratedTokenPreview = {
    name: string;
    plain_text_token: string;
    abilities: string[];
    expires_at?: string | null;
} | null;

type TokenIndexProps = {
    tokens: App.Http.Resources.TokenResource[];
    stats: {
        total: number;
        active: number;
        created_this_month: number;
        last_used_at: string | null;
    };
    expiration_presets: ExpirationPreset[];
    generated_token?: GeneratedTokenPreview;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tokens de API',
        href: route('tokens.index'),
    },
];

const formatRelative = (value?: string | null) => {
    if (!value) return null;
    return formatDistanceToNow(new Date(value), { addSuffix: true, locale: ptBR });
};

const TokensIndex = (props: SharedData<TokenIndexProps>) => {
    const tokens = props.tokens ?? [];
    const expirationPresets = useMemo(() => props.expiration_presets ?? [], [props.expiration_presets]);
    const stats = props.stats ?? { total: 0, active: 0, created_this_month: 0, last_used_at: null };

    const [tokenPreview, setTokenPreview] = useState<GeneratedTokenPreview>(props.generated_token ?? null);
    const [showPreview, setShowPreview] = useState(Boolean(props.generated_token));
    const [tokenToRevoke, setTokenToRevoke] = useState<App.Http.Resources.TokenResource | null>(null);
    const [isRevoking, setIsRevoking] = useState(false);
    const [expirationChoice, setExpirationChoice] = useState('null');
    const [customExpiration, setCustomExpiration] = useState<string>('');
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

    const statsCards = [
        {
            label: 'Tokens ativos',
            value: stats.active ?? 0,
            description: 'Sem expiração ou ainda válidos.',
            icon: ShieldCheck,
        },
        {
            label: 'Tokens criados',
            value: stats.total ?? 0,
            description: `${stats.created_this_month ?? 0} neste mês.`,
            icon: Shield,
        },
        {
            label: 'Último uso',
            value: stats.last_used_at ? formatRelative(stats.last_used_at) : 'Ainda não utilizado',
            description: 'Atualizado quando um token autentica uma chamada.',
            icon: PlusCircle,
        },
    ];

    const { data, setData, post, processing, reset, errors } = useForm<{
        name: string;
        expires_in: number | null;
    }>({
        name: '',
        expires_in: null,
    });

    useEffect(() => {
        setTokenPreview(props.generated_token ?? null);
        setShowPreview(Boolean(props.generated_token));
    }, [props.generated_token]);

    const handleExpirationChange = (value: string) => {
        setExpirationChoice(value);

        if (value === 'custom') {
            setData('expires_in', customExpiration ? Number(customExpiration) : null);
            return;
        }

        setCustomExpiration('');

        if (value === 'null') {
            setData('expires_in', null);
            return;
        }

        setData('expires_in', Number(value));
    };

    const handleCustomExpirationChange = (value: string) => {
        setCustomExpiration(value);
        if (value === '') {
            setData('expires_in', null);
            return;
        }

        const parsed = Number(value);
        setData('expires_in', Number.isFinite(parsed) ? parsed : null);
    };

    const handleCopy = async (value: string, label = 'Copiado!') => {
        try {
            await navigator.clipboard.writeText(value);
            toast.success(label);
        } catch {
            toast.error('Não foi possível copiar.');
        }
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        post(route('tokens.store'), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setExpirationChoice('null');
                setCustomExpiration('');
                setIsCreateDialogOpen(false);
            },
        });
    };

    const revokeToken = () => {
        if (!tokenToRevoke) return;

        setIsRevoking(true);
        router.delete(route('tokens.destroy', tokenToRevoke.id), {
            preserveScroll: true,
            onFinish: () => setIsRevoking(false),
            onSuccess: () => setTokenToRevoke(null),
        });
    };

    return (
        <>
            <Head title="Tokens de API" />

            <div className="container mx-auto flex flex-1 flex-col space-y-6 p-4">
                {tokenPreview && showPreview && (
                    <Alert className="border-primary/40 bg-primary/5">
                        <AlertCircle className="text-primary h-5 w-5" />
                        <AlertTitle>Salve este token em um local seguro</AlertTitle>
                        <AlertDescription className="space-y-3">
                            <p>Este token será exibido apenas uma vez. Use-o para autenticar suas integrações.</p>
                            <div className="flex flex-wrap items-center gap-2">
                                <InlineCode code={tokenPreview.plain_text_token} className="text-sm" />
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleCopy(tokenPreview.plain_text_token)}
                                    className="gap-1"
                                >
                                    <Copy className="h-4 w-4" />
                                    Copiar token
                                </Button>
                                <Button type="button" variant="ghost" size="sm" onClick={() => setShowPreview(false)}>
                                    Fechar
                                </Button>
                            </div>
                            <div className="flex flex-wrap gap-2 text-xs">
                                {(tokenPreview.abilities ?? []).length > 0 ? (
                                    tokenPreview.abilities.includes('*') ? (
                                        <Badge>Acesso total</Badge>
                                    ) : (
                                        tokenPreview.abilities.map((ability) => (
                                            <Badge key={ability} variant="outline">
                                                {ability}
                                            </Badge>
                                        ))
                                    )
                                ) : (
                                    <Badge variant="outline">Permissões padrão</Badge>
                                )}
                                <Badge variant="secondary">
                                    {tokenPreview.expires_at
                                        ? `Expira em ${format(new Date(tokenPreview.expires_at), 'dd/MM/yyyy')}`
                                        : 'Sem expiração'}
                                </Badge>
                            </div>
                        </AlertDescription>
                    </Alert>
                )}

                <div className="space-y-6">
                    <Card>
                        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <ShieldCheck className="h-5 w-5 text-primary" />
                                    Tokens e integrações
                                </CardTitle>
                                <CardDescription>Crie tokens pessoais para conectar serviços externos com segurança.</CardDescription>
                            </div>
                            <Button onClick={() => setIsCreateDialogOpen(true)}>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Novo token
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 sm:grid-cols-3">
                                {statsCards.map((item) => (
                                    <div key={item.label} className="rounded-xl border p-4">
                                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                                            <span>{item.label}</span>
                                            <item.icon className="text-primary/70 h-4 w-4" />
                                        </div>
                                        <p className="text-2xl font-semibold">{item.value}</p>
                                        <p className="text-muted-foreground text-xs">{item.description}</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Shield className="h-5 w-5" />
                                    Tokens ativos
                                </CardTitle>
                                <CardDescription>Revogue tokens antigos e acompanhe o uso das integrações.</CardDescription>
                            </div>
                            <Button variant="outline" onClick={() => setIsCreateDialogOpen(true)}>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Novo token
                            </Button>
                        </CardHeader>
                        <CardContent>
                            {tokens.length === 0 ? (
                                <div className="rounded-lg border border-dashed p-10 text-center">
                                    <p className="text-sm text-muted-foreground">Nenhum token criado ainda.</p>
                                    <Button className="mt-4" onClick={() => setIsCreateDialogOpen(true)}>
                                        Criar primeiro token
                                    </Button>
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Token</TableHead>
                                            <TableHead>Permissões</TableHead>
                                            <TableHead>Último uso</TableHead>
                                            <TableHead>Expiração</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Ações</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {tokens.map((token) => {
                                        const lastUsed = token.lastUsedAt ? new Date(token.lastUsedAt) : null;
                                        const expiresAt = token.expiresAt ? new Date(token.expiresAt) : null;
                                        const isExpired = expiresAt ? expiresAt.getTime() < Date.now() : false;
                                        const relativeLastUsed = lastUsed ? formatDistanceToNow(lastUsed, { addSuffix: true, locale: ptBR }) : 'Nunca utilizado';

                                        return (
                                            <TableRow key={token.id}>
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span className="font-medium">{token.name}</span>
                                                        <span className="text-muted-foreground text-xs">
                                                            Criado em {format(new Date(token.createdAt), 'dd/MM/yyyy HH:mm')}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {token.abilities.length === 0 ? (
                                                            <Badge variant="outline">Padrão</Badge>
                                                        ) : token.abilities.includes('*') ? (
                                                            <Badge>Acesso total</Badge>
                                                        ) : (
                                                            token.abilities.map((ability) => (
                                                                <Badge key={`${token.id}-${ability}`} variant="outline">
                                                                    {ability}
                                                                </Badge>
                                                            ))
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="text-sm">
                                                        <p>{relativeLastUsed}</p>
                                                        {lastUsed && (
                                                            <p className="text-muted-foreground text-xs">
                                                                {format(lastUsed, 'dd/MM/yyyy HH:mm')}
                                                            </p>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {expiresAt ? (
                                                        <div className="text-sm">
                                                            <p>{format(expiresAt, 'dd/MM/yyyy')}</p>
                                                            <p className="text-muted-foreground text-xs">
                                                                Expira {formatDistanceToNow(expiresAt, { addSuffix: true, locale: ptBR })}
                                                            </p>
                                                        </div>
                                                    ) : (
                                                        <Badge variant="secondary">Sem expiração</Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={isExpired ? 'destructive' : 'secondary'} className="gap-1">
                                                        {isExpired ? (
                                                            <>
                                                                <ShieldOff className="h-3.5 w-3.5" />
                                                                Expirado
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Check className="h-3.5 w-3.5" />
                                                                Ativo
                                                            </>
                                                        )}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem onClick={() => handleCopy(token.id, 'ID copiado!')}>
                                                                <Copy className="mr-2 h-4 w-4" />
                                                                Copiar ID
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                className="text-destructive focus:text-destructive"
                                                                onClick={() => setTokenToRevoke(token)}
                                                            >
                                                                <AlertCircle className="mr-2 h-4 w-4" />
                                                                Revogar
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
            <ResponsiveDialog
                isOpen={isCreateDialogOpen}
                setIsOpen={setIsCreateDialogOpen}
                title="Novo token"
                description="Defina um nome amigável, permissões e um prazo de validade."
            >
                <form onSubmit={handleSubmit} className="mt-4 space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="token-name">Nome do token</Label>
                        <Input
                            id="token-name"
                            value={data.name}
                            onChange={(event) => setData('name', event.target.value)}
                            placeholder="Ex.: Integração Zapier"
                            required
                        />
                        <InputError message={errors.name} />
                    </div>

                    <div className="rounded-lg border border-dashed bg-muted/40 p-4 text-sm text-muted-foreground">
                        Tokens criados aqui recebem acesso total (`*`) para facilitar integrações pessoais. Você sempre pode
                        revogá-los quando não precisar mais.
                    </div>

                    <Separator />

                    <div className="space-y-2">
                        <Label>Expiração</Label>
                        <Select value={expirationChoice} onValueChange={handleExpirationChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione a validade" />
                            </SelectTrigger>
                            <SelectContent>
                                {expirationPresets.map((preset) => (
                                    <SelectItem key={`${preset.label}-${preset.value ?? 'null'}`} value={preset.value === null ? 'null' : String(preset.value)}>
                                        {preset.label}
                                    </SelectItem>
                                ))}
                                <SelectItem value="custom">Personalizar…</SelectItem>
                            </SelectContent>
                        </Select>
                        {expirationChoice === 'custom' && (
                            <div className="mt-2 space-y-2">
                                <Label htmlFor="custom-expiration" className="text-xs">
                                    Informe o número de dias
                                </Label>
                                <Input
                                    id="custom-expiration"
                                    type="number"
                                    min={1}
                                    max={3650}
                                    value={customExpiration}
                                    onChange={(event) => handleCustomExpirationChange(event.target.value)}
                                    placeholder="Ex.: 45"
                                />
                            </div>
                        )}
                        <InputError message={errors.expires_in} />
                    </div>

                    <Button type="submit" className="w-full gap-2" disabled={processing}>
                        {processing ? 'Criando...' : 'Criar token'}
                    </Button>
                </form>
            </ResponsiveDialog>
            <ConfirmDialog
                open={tokenToRevoke !== null}
                onOpenChange={(open) => !open && setTokenToRevoke(null)}
                title="Revogar token"
                description={`Ao confirmar, o token "${tokenToRevoke?.name}" perderá acesso imediatamente.`}
                confirmLabel="Revogar"
                confirmVariant="destructive"
                onConfirm={revokeToken}
                loading={isRevoking}
            />
        </>
    );
};

TokensIndex.layout = (page: React.ReactNode) => <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>;

export default TokensIndex;
