import { Transaction } from "@/types";
import { Table } from "@tanstack/react-table";
import { createContext, useContext, useMemo } from "react";

interface TransactionsTableContextType<TData = any, TValue = any> {
    table: Table<Transaction>;
    query: App.Domain.Transaction.Queries.IndexTransactionsQuery;
    setQuery: (
        query: App.Domain.Transaction.Queries.IndexTransactionsQuery,
    ) => void;
}

export const DataTableContext = createContext<TransactionsTableContextType<
    any,
    any
> | null>(null);

export function TransactionsTableProvider<TData, TValue>({
    children,
    ...props
}: TransactionsTableContextType<TData, TValue> & {
    children: React.ReactNode;
}) {
    const value = useMemo(() => ({ ...props }), [props.table, props.query]);

    return (
        <DataTableContext.Provider value={value}>
            {children}
        </DataTableContext.Provider>
    );
}

export function useTransactionsTable<TData, TValue>() {
    const context = useContext(DataTableContext);

    if (!context) {
        throw new Error("useDataTable must be used within a DataTableProvider");
    }

    return context as TransactionsTableContextType<TData, TValue>;
}
