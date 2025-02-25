import { DatePickerWithRange } from "@/Components/DateRangePicker";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import { Transaction } from "@/types";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { DataTable } from "./DataTable";
import { columns } from "./Columns";

export default function TransactionsTable({
    transactions,
}: {
    transactions: Transaction[];
}) {
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [date, setDate] = useState<DateRange | undefined>(undefined);
    const [filteredTransactions, setFilteredTransactions] = useState<
        Transaction[]
    >([]);

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap gap-4">
                <Input
                    placeholder="Search transactions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
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
                        setSearchTerm("");
                        setCategoryFilter("");
                        setDate(undefined);
                    }}
                >
                    Clear Filters
                </Button>
            </div>
            <div className="rounded-md border">
                <DataTable columns={columns} data={transactions} />

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
