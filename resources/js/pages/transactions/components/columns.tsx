import { CategoryBadge } from '@/components/category-badge';
import { Button } from '@/components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { TransactionActionDropdown } from './transaction-actions-dropdown';

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
        header: 'Account',
    },
    {
        accessorKey: 'amount.formatted',
        header: 'Amount',
    },
    {
        accessorKey: 'category',
        header: 'Category',
        cell: ({ row }) => {
            const category = row.getValue('category') as App.Http.Resources.CategoryResource;
            if (category) {
                return <CategoryBadge key={category.id} category={category} />;
            }
        },
    },
    {
        accessorKey: 'memo',
        header: 'Memo',
        cell: ({ row }) => {
            const memo = row.original.memo;
            if (!memo) return null;
            return (
                <div className="max-w-[15rem] truncate" title={memo}>
                    {memo}
                </div>
            );
        },
    },

    {
        accessorKey: 'date',
        header: 'Date',
        cell: ({ row }) => {
            if (row.getValue('date')) {
                const date = new Date(row.getValue('date'));
                return new Intl.DateTimeFormat(navigator.language).format(date);
            }
        },
    },
    {
        id: 'actions',
        cell: ({ row }) => (
            <TransactionActionDropdown transaction={row.original} />
        ),
    },
];
