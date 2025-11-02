import { router } from '@inertiajs/react';
import { createContext, useCallback, useContext, useMemo, useState } from 'react';

type TransactionsQuery = App.Http.Requests.Transaction.IndexTransactionRequest;

const TransactionsQueryContext = createContext<TransactionsQueryContextValue | undefined>(undefined);

export const TransactionsQueryProvider = ({ children }: { children: React.ReactNode }) => {
    const [query, setQuery] = useState<TransactionsQuery>(() => {
        const params = new URLSearchParams(window.location.search);
        // This is a simplified parsing logic. A more robust solution would involve a library like qs
        // and a schema validation library like Zod to handle complex nested objects and arrays.
        const orderByColumn = params.get('order_by[column]');
        const directionParam = params.get('order_by[direction]');
        const orderByDirection = directionParam === 'asc' || directionParam === 'desc' ? (directionParam as App.Enums.OrderByDirection) : null;

        const initialState: TransactionsQuery = {
            search: params.get('search'),
            categories: params.getAll('categories[]'),
            accounts: params.getAll('accounts[]'),
            start_date: params.get('start_date'),
            end_date: params.get('end_date'),
            order_by: orderByColumn && orderByDirection
                ? { column: orderByColumn, direction: orderByDirection }
                : null,
            type: params.get('type') as App.Enums.TransactionType | null,
            page: params.has('page') ? Number(params.get('page')) : 1,
            per_page: params.has('per_page') ? Number(params.get('per_page')) : 15,
        };
        return initialState;
    });

    const updateQuery = useCallback(
        (newQuery: Partial<TransactionsQuery>) => {
            const updatedQuery = { ...query, ...newQuery };
            setQuery(updatedQuery);

            const inertiaQuery = { ...updatedQuery } as Record<string, unknown>;

            if (!updatedQuery.order_by) {
                delete inertiaQuery.order_by;
            }

            router.get(route('transactions.index'), inertiaQuery as any, {
                preserveState: true,
                replace: true,
                only: ['transactions'],
            });
        },
        [query],
    );

    const contextValue = useMemo(() => ({ query, updateQuery }), [query, updateQuery]);

    return <TransactionsQueryContext.Provider value={contextValue}>{children}</TransactionsQueryContext.Provider>;
};

export const useTransactionsQuery = () => {
    const context = useContext(TransactionsQueryContext);
    if (!context) {
        throw new Error('useTransactionsQuery must be used within a TransactionsQueryProvider');
    }
    return context;
};

interface TransactionsQueryContextValue {
    query: TransactionsQuery;
    updateQuery: (newQuery: Partial<TransactionsQuery>) => void;
}
