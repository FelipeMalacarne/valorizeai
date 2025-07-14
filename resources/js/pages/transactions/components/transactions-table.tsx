import { ColumnDef, flexRender, getCoreRowModel, getExpandedRowModel, useReactTable } from '@tanstack/react-table';

import { CategoryBadge } from '@/components/category-badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2 } from 'lucide-react';
import React from 'react';

interface TransactionsTableProps {
    columns: ColumnDef<App.Http.Resources.TransactionResource>[];
    transactions: App.Http.Resources.TransactionResource[];
}

export function TransactionsTable({ columns, transactions }: TransactionsTableProps) {
    const removeSplit = (transactionId: string, splitId: string) => {
        console.log('Removing split:', transactionId, splitId);
    };

    const table = useReactTable({
        data: transactions,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
        getRowCanExpand: (row) => !!(row.original.splits && row.original.splits.length > 0),
    });

    const renderSubRow = (subRow: App.Http.Resources.TransactionSplitResource, parentId: string) => (
        <TableRow key={subRow.id} className="bg-muted/30">
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>

            <TableCell>
                <div className="font-medium">${subRow.amount.amount.toFixed(2)}</div>
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
        <div className="rounded-md border">
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
        </div>
    );
}
