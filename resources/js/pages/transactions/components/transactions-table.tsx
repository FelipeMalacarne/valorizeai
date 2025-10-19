import { ColumnDef, flexRender, getCoreRowModel, getExpandedRowModel, useReactTable } from '@tanstack/react-table';

import { CategoryBadge } from '@/components/category-badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2 } from 'lucide-react';
import React from 'react';
import { PaginatedResource } from '@/types';
import { DataTablePagination } from '@/components/data-table-pagination';

interface TransactionsTableProps {
    columns: ColumnDef<App.Http.Resources.TransactionResource>[];
    transactions: PaginatedResource<App.Http.Resources.TransactionResource>;
}

export function TransactionsTable({ columns, transactions }: TransactionsTableProps) {
    const removeSplit = (transactionId: string, splitId: string) => {
        console.log('Removing split:', transactionId, splitId);
    };

    console.log(transactions)

    const table = useReactTable<TData>({
        data: transactions.data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
        getRowCanExpand: (row) => !!(row.original.splits && row.original.splits.length > 0),
        manualPagination: true,
        rowCount: transactions.total
    });

    const renderSubRow = (subRow: App.Http.Resources.TransactionSplitResource, parentId: string) => (
        <TableRow key={subRow.id} className="bg-muted/30">
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>

            <TableCell>
                <div className="font-medium">${subRow.amount.value.toFixed(2)}</div>
            </TableCell>

            <TableCell>
                <CategoryBadge key={subRow.category.id} category={subRow.category} />
            </TableCell>

            <TableCell>
                <div className="text-muted-foreground pl-6 text-sm">{subRow.memo || 'Split item'}</div>
            </TableCell>

            <TableCell>
                <Button className="h-6 w-6" variant="outline" size="icon" onClick={() => removeSplit(parentId, subRow.id)}>
                    <Trash2 className="h-2 w-2" />
                </Button>
            </TableCell>
        </TableRow>
    );

    return (
        <div className="rounded-md border space-y-4 p-4">
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                );
                            })}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <React.Fragment key={row.id}>
                                <TableRow data-state={row.getIsSelected() && 'selected'}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                                    ))}
                                </TableRow>

                                {row.getIsExpanded() && row.original.splits?.map((subRow) => renderSubRow(subRow, row.original.id))}
                            </React.Fragment>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="h-24 text-center">
                                No results.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            <DataTablePagination
                table={table}
                currentPage={transactions.current_page}
                lastPage={transactions.last_page}
                perPage={transactions.per_page}
                firstPageUrl={transactions.first_page_url}
                lastPageUrl={transactions.last_page_url}
                nextPageUrl={transactions.next_page_url}
                prevPageUrl={transactions.prev_page_url}
                // meta={transactions.meta}
            />
        </div>
    );
}
