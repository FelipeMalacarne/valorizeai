import { ActionButtonLink } from '@/components/action-button-link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { router } from '@inertiajs/react';
import { X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export function AccountFilters({ className = '' }: { className?: string }) {
    const initialQuery: App.Http.Requests.Account.IndexAccountsRequest = {
        search: '',
        type: null,
        currency: null,
    };
    const [query, setQuery] = useState<App.Http.Requests.Account.IndexAccountsRequest>(initialQuery);
    const [filtersCount, setFiltersCount] = useState(0);

    const initialRender = useRef(true);
    useEffect(() => {
        if (initialRender.current) {
            initialRender.current = false;
            return;
        }

        setFiltersCount(Object.keys(query).filter((key) => query[key as keyof App.Http.Requests.Account.IndexAccountsRequest]).length);

        router.visit(route('accounts.index'), {
            data: query,
            preserveState: true,
            preserveScroll: true,
        });
    }, [query]);

    const clearFilters = () => {
        setQuery(initialQuery);
    };

    return (
        <Card className={className}>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className='space-y-1'>
                        <CardTitle>Contas Bancárias</CardTitle>
                        <CardDescription> Vizualize e gerencie suas contas Bancárias </CardDescription>
                    </div>

                    <ActionButtonLink action="create" href={route('accounts.create')} prefetch/>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 items-center justify-between gap-4 md:grid-cols-5">
                    <Input
                        className="col-span-2 md:col-span-3"
                        placeholder="Pesquisar..."
                        value={query.search ?? ''}
                        onChange={(e) => setQuery({ ...query, search: e.target.value })}
                        tabIndex={1}
                    />

                    <Select
                        value={query.type ?? ''}
                        onValueChange={(value) => setQuery({ ...query, type: (value as App.Enums.AccountType) || null })}
                    >
                        <SelectTrigger tabIndex={2}>
                            <SelectValue placeholder="Tipo" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="checking">Corrente</SelectItem>
                                <SelectItem value="investment">Investimento</SelectItem>
                                <SelectItem value="credit">Crédito</SelectItem>
                                <SelectItem value="savings">Poupança</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>

                    <div className="flex justify-between gap-4">
                        <Select
                            value={query.currency ?? ''}
                            onValueChange={(value) => setQuery({ ...query, currency: (value as App.Enums.Currency) || null })}
                        >
                            <SelectTrigger tabIndex={3}>
                                <SelectValue placeholder="Moeda" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="BRL">BRL</SelectItem>
                                    <SelectItem value="USD">USD</SelectItem>
                                    <SelectItem value="EUR">EUR</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>

                        {filtersCount > 0 && (
                            <Button variant={'ghost'} size={'icon'} onClick={clearFilters} tabIndex={3}>
                                <X />
                            </Button>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
