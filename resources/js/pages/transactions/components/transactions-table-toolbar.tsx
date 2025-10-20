
import { DataTableFilter } from "@/components/data-table-filter";
import { DataTableViewOptions } from "@/components/data-table-view-options";
import { DatePickerWithRange } from "@/components/date-range-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTransactionsQuery } from "@/providers/transactions-query-provider";
import { usePage } from "@inertiajs/react";
import { X } from "lucide-react";
import { DateRange } from "react-day-picker";
import { TransactionsIndexProps } from "..";
import { SharedData } from "@/types";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useReactTable } from "@tanstack/react-table";

export function TransactionsTableToolbar({ table }: { table: ReturnType<typeof useReactTable> }) {
    const { query, updateQuery } = useTransactionsQuery();
    const { categories, accounts } =
        usePage<SharedData<TransactionsIndexProps>>().props;
    const isFiltered =
        query.search ||
        query.start_date ||
        query.end_date ||
        (query.accounts && query.accounts.length > 0) ||
        (query.categories && query.categories.length > 0) ||
        query.type;

    const range: DateRange = {
        from: query.start_date ? new Date(query.start_date) : undefined,
        to: query.end_date ? new Date(query.end_date) : undefined,
    };

    const handleRangeChanged = (range: DateRange | undefined) => {
        if (!range) {
            updateQuery({
                start_date: null,
                end_date: null,
            });

            return;
        }

        updateQuery({
            start_date: range.from?.toISOString() ?? null,
            end_date: range.to?.toISOString() ?? null,
        });
    };

    const clearQuery = () => {
        updateQuery({
            search: null,
            start_date: null,
            end_date: null,
            categories: [],
            accounts: [],
            type: null,
        });
    };

    return (
        <div className="flex items-center justify-between gap-2 overflow-auto">
            <div className="flex flex-1 items-center space-x-2">
                <Input
                    placeholder="Filtrar transações..."
                    value={query.search ?? ""}
                    onChange={(event) =>
                        updateQuery({ search: event.target.value })
                    }
                    className="h-8 w-[150px] lg:w-[250px]"
                />
                <Select
                    value={query.type || ""}
                    onValueChange={(
                        value: App.Enums.TransactionType | "all",
                    ) => {
                        if (value === "all") {
                            updateQuery({ type: null });
                            return;
                        }

                        updateQuery({ type: value });
                    }}
                >
                    <SelectTrigger className="h-8 w-[100px]">
                        <SelectValue placeholder="Tipo" />
                    </SelectTrigger>
                    <SelectContent className="w-[80px]">
                        <SelectItem value="credit">Entradas</SelectItem>
                        <SelectItem value="debit">Saídas</SelectItem>
                        <SelectItem value="all">Todas</SelectItem>
                    </SelectContent>
                </Select>
                <DataTableFilter
                    title="Categorias"
                    options={categories.map((category) => ({
                        label: category.name,
                        value: category.id,
                    }))}
                    selectedValues={query.categories || []}
                    setSelectedValues={(values) =>
                        updateQuery({ categories: values })
                    }
                />
                <DataTableFilter
                    title="Contas"
                    options={accounts.map((account) => ({
                        label: account.name,
                        value: account.id,
                    }))}
                    selectedValues={query.accounts || []}
                    setSelectedValues={(values) =>
                        updateQuery({ accounts: values })
                    }
                />
                {isFiltered && (
                    <Button
                        variant="ghost"
                        onClick={clearQuery}
                        className="h-8 px-2 lg:px-3"
                    >
                        Limpar Filtros
                        <X />
                    </Button>
                )}
            </div>

            <DatePickerWithRange date={range} setDate={handleRangeChanged} />
            <DataTableViewOptions table={table} />
        </div>
    );
}
