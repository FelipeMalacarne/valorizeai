// import { DataTableFilterField } from "@/Pages/Transactions/components/Types";
// import { ColumnDef, ColumnFiltersState, RowSelectionState, SortingState, VisibilityState } from "@tanstack/react-table";
// import { createContext, useContext, useMemo } from "react";

// interface Table<T> {
//     data: T[];
//     total: number;
// }

// interface DataTableContextType<TData = unknown, TValue = unknown> {
//     table: Table<TData>;
//     filterFields: DataTableFilterField<TData>[];
//     columns: ColumnDef<TData, TValue>[];
//     enableColumnOrdering: boolean;
//     isLoading?: boolean;
//     // REMINDER: controlled state, allowing to rerender the component on state changes
//     columnFilters: ColumnFiltersState;
//     sorting: SortingState;
//     rowSelection: RowSelectionState;
//     columnOrder: string[];
//     columnVisibility: VisibilityState;
// }

// export const DataTableContext = createContext<DataTableContextType<
//     any,
//     any
// > | null>(null);

// export function DataTableProvider<TData, TValue>({
//     children,
//     ...props
// }: DataTableContextType<TData, TValue> & {
//     children: React.ReactNode;
// }) {
//     const value = useMemo(
//         () => ({ ...props }),
//         [
//             props.columnFilters,
//             props.sorting,
//             props.rowSelection,
//             props.columnOrder,
//             props.columnVisibility,
//             props.table,
//             props.filterFields,
//             props.columns,
//             props.enableColumnOrdering,
//             props.isLoading,
//         ],
//     );

//     return (
//         <DataTableContext.Provider value={value}>
//             {children}
//         </DataTableContext.Provider>
//     );
// }

// export function useDataTable<TData, TValue>() {
//     const context = useContext(DataTableContext);

//     if (!context) {
//         throw new Error("useDataTable must be used within a DataTableProvider");
//     }

//     return context as DataTableContextType<TData, TValue>;
// }
