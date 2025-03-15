import { DataTableFilter } from "@/components/data-table-filter";
import { DataTableViewOptions } from "@/components/data-table-view-options";
import { DatePickerWithRange } from "@/components/date-range-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTransactionsTable } from "@/Providers/TransactionsTableProvider";
import { PageProps } from "@/types";
import { usePage } from "@inertiajs/react";
import { X } from "lucide-react";
import { DateRange } from "react-day-picker";
import { TransactionIndexProps } from "..";

export function TransactionsTableToolbar() {
    const { table, query, setQuery } = useTransactionsTable();
    const { categories, accounts } =
        usePage<PageProps<TransactionIndexProps>>().props;
    const isFiltered = table.getState().columnFilters.length > 0;

    const range: DateRange = {
        from: query.start_date ? new Date(query.start_date) : undefined,
        to: query.end_date ? new Date(query.end_date) : undefined,
    };

    const handleRangeChanged = (range: DateRange | undefined) => {
        if (!range) {
            setQuery({
                ...query,
                start_date: null,
                end_date: null,
            });

            return;
        }

        setQuery({
            ...query,
            start_date: range.from?.toISOString() ?? null,
            end_date: range.to?.toISOString() ?? null,
        });
    };

    const handleCategoriesChanged = (values: string[]) => {
        setQuery({ ...query, categories: values });
    };

    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center space-x-2">
                <Input
                    placeholder="Filter transactions..."
                    value={query.search ?? ""}
                    onChange={(event) =>
                        setQuery({ ...query, search: event.target.value })
                    }
                    className="h-8 w-[150px] lg:w-[250px]"
                />
                <DatePickerWithRange
                    date={range}
                    setDate={handleRangeChanged}
                />
                <DataTableFilter
                    title="Categories"
                    options={categories.data.map((category) => ({
                        label: category.name,
                        value: category.id,
                    }))}
                    selectedValues={query.categories || []}
                    setSelectedValues={handleCategoriesChanged}
                />

                <DataTableFilter
                    title="Accounts"
                    options={accounts.data.map((account) => ({
                        label: account.name,
                        value: account.id,
                    }))}
                    selectedValues={query.accounts || []}
                    setSelectedValues={(values) =>
                        setQuery({ ...query, accounts: values })
                    }
                />
                {isFiltered && (
                    <Button
                        variant="ghost"
                        onClick={() => table.resetColumnFilters()}
                        className="h-8 px-2 lg:px-3"
                    >
                        Reset
                        <X />
                    </Button>
                )}
            </div>
            <DataTableViewOptions table={table} />
        </div>
    );
}
