import { PaginatedResource, Transaction } from "@/types";
import { useEffect, useRef, useState } from "react";
import { DataTable } from "./DataTable";
import { columns } from "./columns";
import LinkPagination from "@/components/LinkPagination";
import { router } from "@inertiajs/react";
import {
    getCoreRowModel,
    useReactTable,
    VisibilityState,
} from "@tanstack/react-table";
import { TransactionsTableProvider } from "@/providers/transactions-table-provider";
import { TransactionsTableToolbar } from "./transactions-table-toolbar";
import { useLocalStorage } from "@/hooks/use-local-storage";

export default function TransactionsTable({
    transactions,
}: {
    transactions: PaginatedResource<Transaction>;
}) {
    const [rowSelection, setRowSelection] = useState({});
    const [columnVisibility, setColumnVisibility] =
        useLocalStorage<VisibilityState>("transactions-table-visibility", {
            id: true,
            money: true,
            categories: true,
            fitid: false,
            memo: true,
            account: true,
            date_posted: true,
        });

    const [query, setQuery] =
        useState<App.Domain.Transaction.Queries.IndexTransactionsQuery>(() => {
            const params = new URLSearchParams(window.location.search);
            return {
                search: params.get("search") || null,
                categories: params.get("categories[]")
                    ? params.get("categories[]")!.split(",")
                    : [],
                accounts: params.get("accounts")
                    ? params.get("accounts")!.split(",")
                    : [],
                order_by: {
                    column: params.get("orderBy[column]") || "created_at",
                    direction:
                        (params.get("orderBy[direction]") as "asc" | "desc") ||
                        "desc",
                },
                start_date: params.get("start_date")
                    ? new Date(params.get("start_date")!).toISOString()
                    : null,
                end_date: params.get("end_date")
                    ? new Date(params.get("end_date")!).toISOString()
                    : null,
                page: 1,
                per_page: 10,
            };
        });

    const isFirstRender = useRef(true);

    useEffect(() => {
        // Skip the very first render (page load).
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const params = new URLSearchParams();

        if (query.search) {
            params.set("search", query.search);
        }
        if (query.categories && query.categories.length > 0) {
            query.categories.forEach((category) => {
                params.append("categories[]", category);
            });
        }
        if (query.accounts && query.accounts.length > 0) {
            query.accounts.forEach((account) => {
                params.append("accounts[]", account);
            });
        }
        if (query.order_by?.column) {
            params.set("orderBy[column]", query.order_by.column);
        }
        if (query.order_by?.direction) {
            params.set("orderBy[direction]", query.order_by.direction);
        }
        if (query.start_date) {
            params.set("start_date", query.start_date);
        }
        if (query.end_date) {
            params.set("end_date", query.end_date);
        }

        params.set("per_page", String(query.per_page));

        params.delete("page");

        router.get(
            `/transactions?${params.toString()}`,
            {},
            { preserveState: true, replace: true, preserveScroll: true },
        );
    }, [query]);

    const table = useReactTable({
        data: transactions.data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
        rowCount: transactions.meta.total,
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            columnVisibility,
            rowSelection,
        },
    });

    return (
        <TransactionsTableProvider
            table={table}
            query={query}
            setQuery={setQuery}
        >
            <div className="space-y-4">
                <div className="rounded-md border">
                    <TransactionsTableToolbar />
                    <DataTable table={table} />

                    <LinkPagination
                        links={transactions.meta.links}
                        lastPageUrl={transactions.links.last}
                        firstPageUrl={transactions.links.first}
                    />

                    {/* <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Account</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Date Posted</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {transactions.map((transaction) => (
                            <TableRow key={transaction.id}>
                                <TableCell>{transaction.id}</TableCell>
                                <TableCell>{transaction.account}</TableCell>
                                <TableCell>{`${transaction.currency} ${transaction.amount}`}</TableCell>
                                <TableCell>
                                    {transaction.categories
                                        .map((category) => category.name)
                                        .join(", ")}
                                </TableCell>
                                <TableCell>{transaction.description}</TableCell>
                                <TableCell>
                                    {new Date(
                                        transaction.date_posted,
                                    ).toLocaleDateString()}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table> */}
                </div>
            </div>
        </TransactionsTableProvider>
    );
}
