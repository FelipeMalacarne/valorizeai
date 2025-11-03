import { CategoryBadge } from '@/components/category-badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useTransactionsQuery } from '@/providers/transactions-query-provider';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronDown, ChevronRight } from 'lucide-react';
import { TransactionActionDropdown } from './transaction-actions-dropdown';

type SortableColumnKey = 'amount' | 'date';

type SortableColumnHeaderProps = {
    columnKey: SortableColumnKey;
    label: string;
    align?: 'start' | 'end';
};

type TableOrderBy = App.Data.OrderBy;
type SortDirection = App.Enums.OrderByDirection;

const SortableColumnHeader = ({ columnKey, label, align = 'start' }: SortableColumnHeaderProps) => {
    const { query, updateQuery } = useTransactionsQuery();

    const isActive = query.order_by?.column === columnKey;
    const direction: SortDirection | null = isActive ? query.order_by?.direction ?? null : null;

    const cycleDirection = () => {
        const nextDirection: SortDirection | null = !isActive
            ? 'desc'
            : direction === 'desc'
                ? 'asc'
                : null;

        const nextOrderBy: TableOrderBy | null = nextDirection
            ? { column: columnKey, direction: nextDirection }
            : null;

        updateQuery({
            order_by: nextOrderBy,
            page: 1,
        });
    };

    const Icon = direction === 'asc' ? ArrowUp : direction === 'desc' ? ArrowDown : ArrowUpDown;

    return (
        <button
            type="button"
            onClick={cycleDirection}
            className={cn(
                'group flex w-full items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground',
                align === 'end' ? 'justify-end text-right' : 'justify-start text-left',
            )}
        >
            <span>{label}</span>
            <Icon className="h-3.5 w-3.5 text-muted-foreground transition-colors group-hover:text-foreground" />
        </button>
    );
};

export const columns: ColumnDef<App.Http.Resources.TransactionResource>[] = [
    {
        id: 'expander',
        header: '',
        cell: ({ row }) => {
            return row.getCanExpand() ? (
                <Button variant="ghost" size="sm" onClick={row.getToggleExpandedHandler()} className="h-6 w-6 p-0">
                    {row.getIsExpanded() ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </Button>
            ) : null;
        },
        size: 40,
    },
    {
        accessorKey: 'account.name',
        header: 'Conta',
        cell: ({ row }) => <div className="font-medium text-foreground">{row.original.account.name}</div>,
    },
    {
        id: 'amount',
        accessorFn: (row) => row.amount.value,
        header: () => <SortableColumnHeader columnKey="amount" label="Valor" align="end" />,
        cell: ({ row }) => (
            <div className="text-right font-semibold text-foreground">{row.original.amount.formatted}</div>
        ),
        size: 150,
    },
    {
        accessorKey: 'category',
        header: 'Categoria',
        cell: ({ row }) => {
            const category = row.getValue('category') as App.Http.Resources.CategoryResource;
            if (category) {
                return <CategoryBadge key={category.id} category={category} />;
            }
        },
    },
    {
        accessorKey: 'memo',
        header: 'Descrição',
        cell: ({ row }) => {
            const memo = row.original.memo;
            if (!memo) return null;
            return (
                <div className="max-w-[16rem] truncate text-muted-foreground" title={memo}>
                    {memo}
                </div>
            );
        },
    },
    {
        id: 'date',
        accessorFn: (row) => row.date,
        header: () => <SortableColumnHeader columnKey="date" label="Data" />,
        cell: ({ row }) => {
            if (row.getValue('date')) {
                const date = new Date(row.getValue('date'));
                return <span className="text-sm text-foreground">{new Intl.DateTimeFormat(navigator.language).format(date)}</span>;
            }
        },
    },
    {
        id: 'actions',
        header: '',
        cell: ({ row }) => (
            <div className="flex justify-end">
                <TransactionActionDropdown transaction={row.original} />
            </div>
        ),
        size: 80,
    },
];
