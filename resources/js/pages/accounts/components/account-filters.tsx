import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { router } from '@inertiajs/react';
import { X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export function AccountFilters() {
    const initialQuery: App.Http.Requests.IndexAccountsRequest = {
        search: '',
    };
    const [query, setQuery] = useState<App.Http.Requests.IndexAccountsRequest>(initialQuery);
    const [filtersCount, setFiltersCount] = useState(0);

    const initialRender = useRef(true);
    useEffect(() => {
        if (initialRender.current) {
            initialRender.current = false;
            return;
        }

        setFiltersCount(Object.keys(query).filter((key) => query[key as keyof App.Http.Requests.IndexAccountsRequest]).length);

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
        <div className="flex items-center justify-between gap-4">
            <Input
                placeholder="Pesquisar por nome ou número da conta"
                value={query.search ?? ''}
                onChange={(e) => setQuery({ ...query, search: e.target.value })}
                tabIndex={1}
            />

            <Select>
                <SelectTrigger tabIndex={2} className="w-[180px]">
                    <SelectValue placeholder="Select a fruit" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        {/* <SelectLabel>Fruits</SelectLabel> */}
                        <SelectItem value="apple">Apple</SelectItem>
                        <SelectItem value="banana">Banana</SelectItem>
                        <SelectItem value="blueberry">Blueberry</SelectItem>
                        <SelectItem value="grapes">Grapes</SelectItem>
                        <SelectItem value="pineapple">Pineapple</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>

            {filtersCount > 0 && (
                <Button variant={'ghost'} size={'icon'} onClick={clearFilters} tabIndex={3}>
                    <X />
                </Button>
            )}
        </div>
    );
}
