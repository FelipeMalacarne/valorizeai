import { Table } from "@tanstack/react-table";
import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
} from "lucide-react";

import { Button } from "./ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select";
import { LinksType, Meta } from "@/types";
import { Link } from "@inertiajs/react";
import { useTransactionsTable } from "@/providers/transactions-table-provider";

interface DataTablePaginationProps<TData> {
    table: Table<TData>;
    links: LinksType;
    meta: Meta;
}
export function DataTablePagination<TData>({
    table,
    links,
    meta,
}: DataTablePaginationProps<TData>) {
    const { query, setQuery } = useTransactionsTable();

    return (
        <div className="flex items-center justify-between px-2 overflow-auto">
            <div className="flex-1 text-sm text-muted-foreground">
                <span>{table.getRowCount()} linhas encontradas.</span>
            </div>
            <div className="flex items-center space-x-6 lg:space-x-8">
                <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium">Linhas por página</p>
                    <Select
                        value={meta.per_page.toString()}
                        onValueChange={(value) => {
                            setQuery({...query, per_page: parseInt(value)});
                        }}
                    >
                        <SelectTrigger className="h-8 w-[70px]">
                            <SelectValue
                                placeholder={
                                    meta.per_page.toString()
                                }
                            />
                        </SelectTrigger>
                        <SelectContent side="top">
                            {[10, 20, 30, 40, 50].map((pageSize) => (
                                <SelectItem
                                    key={pageSize}
                                    value={`${pageSize}`}
                                >
                                    {pageSize}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                    Página {meta.current_page} de {meta.last_page}
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        className="hidden h-8 w-8 p-0 lg:flex"
                        disabled={meta.current_page === 1}
                        asChild
                    >
                        <Link as="button" href={links.first} prefetch preserveState preserveScroll>
                            <span className="sr-only">Go to first page</span>
                            <ChevronsLeft />
                        </Link>
                    </Button>
                    <Button
                        variant="outline"
                        className="h-8 w-8 p-0"
                        disabled={links.prev === null}
                        asChild
                    >
                        <Link as="button" href={links.prev || "#"} prefetch preserveScroll preserveState>
                            <span className="sr-only">Go to previous page</span>
                            <ChevronLeft />
                        </Link>
                    </Button>
                    <Button
                        variant="outline"
                        className="h-8 w-8 p-0"
                        asChild
                        disabled={links.next === null}
                    >
                        <Link as="button" href={links.next || "#"} prefetch preserveState preserveScroll>
                            <span className="sr-only">Go to next page</span>
                            <ChevronRight />
                        </Link>
                    </Button>

                    <Button
                        asChild
                        variant="outline"
                        className="hidden h-8 w-8 p-0 lg:flex"
                        disabled={meta.current_page === meta.last_page}
                    >
                        <Link as="button" href={links.last} prefetch preserveState preserveScroll>
                            <span className="sr-only">Go to last page</span>
                            <ChevronsRight />
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
