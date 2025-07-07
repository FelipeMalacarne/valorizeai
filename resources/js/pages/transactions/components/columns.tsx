import { CategoryBadge } from '@/components/category-badge';
import { ColumnDef } from '@tanstack/react-table';

export const columns: ColumnDef<App.Http.Resources.TransactionResource>[] = [
    {
        accessorKey: 'date',
        header: 'Date',
        cell: ({ row }) => {
            const date = new Date(row.getValue('date'));
            return new Intl.DateTimeFormat(navigator.language).format(date);
        },
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

            return <CategoryBadge key={category.id} category={category} />;
        },
    },
    {
        accessorKey: 'memo',
        header: 'Memo',
    },
];
