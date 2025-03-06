import { DatePickerWithRange } from "@/components/date-range-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { PaginatedResource, Transaction } from "@/types";
import { useEffect, useRef, useState } from "react";
import { DateRange } from "react-day-picker";
import { DataTable } from "./DataTable";
import { columns } from "./Columns";
import LinkPagination from "@/components/LinkPagination";
import { router } from "@inertiajs/react";

export default function TransactionsTable({
    transactions,
}: {
    transactions: PaginatedResource<Transaction>;
}) {
    const [categoryFilter, setCategoryFilter] = useState("");
    const [date, setDate] = useState<DateRange | undefined>(undefined);
    const [filteredTransactions, setFilteredTransactions] = useState<
        Transaction[]
    >([]);

    const [query, setQuery] = useState({
        search: "",
        orderBy: {
            column: "created_at",
            direction: "desc",
        },
    });

    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const params = new URLSearchParams(window.location.search);

        // Update the "search" parameter based on input:
        if (query.search) {
            params.set("search", query.search);
        } else {
            params.delete("search");
        }

        // Similarly for orderBy parameters:
        if (query.orderBy.column) {
            params.set("orderBy[column]", query.orderBy.column);
        } else {
            params.delete("orderBy[column]");
        }
        if (query.orderBy.direction) {
            params.set("orderBy[direction]", query.orderBy.direction);
        } else {
            params.delete("orderBy[direction]");
        }

        // For date parameters, you could do the same if needed:
        // if (date.from) {
        //   params.set('from', new Date(date.from).toISOString());
        // } else {
        //   params.delete('from');
        // }
        // if (date.to) {
        //   params.set('to', new Date(date.to).toISOString());
        // } else {
        //   params.delete('to');
        // }

        console.log(params.toString());
        router.get(
            `/transactions?${params.toString()}`,
            {},
            { preserveState: true, replace: true, preserveScroll: true },
        );
    }, [query, date]);

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap gap-4">
                <Input
                    placeholder="Search transactions..."
                    value={query.search}
                    onChange={(e) =>
                        setQuery({ ...query, search: e.target.value })
                    }
                    className="max-w-sm"
                />
                <Select
                    value={categoryFilter}
                    onValueChange={setCategoryFilter}
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {/* Add category options here */}
                    </SelectContent>
                </Select>
                <DatePickerWithRange date={date} setDate={setDate} />
                <Button
                    onClick={() => {
                        setCategoryFilter("");
                        setDate(undefined);
                    }}
                >
                    Clear Filters
                </Button>
            </div>
            <div className="rounded-md border">
                <DataTable
                    columns={columns}
                    data={transactions.data}
                    total={transactions.meta.total}
                    links={transactions.meta.links}
                />

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
    );
}
