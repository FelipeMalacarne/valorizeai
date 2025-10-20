import { router } from '@inertiajs/react';
import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const TransactionsQueryContext = createContext<TransactionsQueryContextValue | undefined>(undefined);

export const TransactionsQueryProvider = ({ children }: { children: React.ReactNode }) => {
    const [query, setQuery] = useState<App.Http.Requests.Transaction.IndexTransactionRequest>(() => {
        const params = new URLSearchParams(window.location.search);
        // This is a simplified parsing logic. A more robust solution would involve a library like qs
        // and a schema validation library like Zod to handle complex nested objects and arrays.
        const initialState: App.Http.Requests.Transaction.IndexTransactionRequest = {
            search: params.get('search'),
            categories: params.getAll('categories[]'),
            accounts: params.getAll('accounts[]'),
            start_date: params.get('start_date'),
            end_date: params.get('end_date'),
            order_by: null, // Order by is not handled in the URL for now
            type: params.get('type') as App.Enums.TransactionType | null,
            page: params.has('page') ? Number(params.get('page')) : 1,
            per_page: params.has('per_page') ? Number(params.get('per_page')) : 15,
        };
        return initialState;
    });

    const updateQuery = useCallback(
        (newQuery: Partial<App.Http.Requests.Transaction.IndexTransactionRequest>) => {
            const updatedQuery = { ...query, ...newQuery };
            setQuery(updatedQuery);
            router.get(route('transactions.index'), updatedQuery as any, {
                preserveState: true,
                replace: true,
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
    query: App.Http.Requests.Transaction.IndexTransactionRequest;
    updateQuery: (newQuery: Partial<App.Http.Requests.Transaction.IndexTransactionRequest>) => void;
}