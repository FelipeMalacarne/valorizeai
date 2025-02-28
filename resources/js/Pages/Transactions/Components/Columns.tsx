import { CategoryBadge } from "@/Components/CategoryBadge";
import { InlineCode } from "@/Components/InlineCodeCopy";
import { Badge } from "@/Components/ui/badge";
import { Category, Transaction } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { IdCard } from "lucide-react";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
// export type Payment = {
//   id: string
//   amount: number
//   status: "pending" | "processing" | "success" | "failed"
//   email: string
// }
//

const styles = {
    badge: "text-lavender bg-lavender/10 border-lavender/20 hover:bg-lavender/10",
};

export const columns: ColumnDef<Transaction>[] = [
    {
        accessorKey: "id",
        header: "ID",
        cell: ({ row }) => {
            const idValue = row.getValue("id") as string;
            return <InlineCode code={idValue} />;
        },
    },
    {
        accessorKey: "money",
        header: "amount",
        cell: ({ row }) => {
            const value = row.getValue("money") as number;
            return <div className="text-right font-medium">{row.getValue("money")}</div>
        },
    },
    // {
    //     accessorKey: "fitid",
    //     header: "Fit ID",
    //     cell: ({ row }) => {
    //         const value = row.getValue("fitid") as string;
    //         return <div className="max-w-[200px] truncate">{value}</div>;
    //     },
    // },
    {
        accessorKey: "memo",
        header: "Memo",
        cell: ({ row }) => {
            const value = row.getValue("memo") as string;
            return <div className="max-w-[200px] truncate">{value}</div>;
        },
    },
    {
        accessorKey: "categories",
        header: "Categories",
        cell: ({ row }) => {
            const value = row.getValue("categories") as Category[];
            return (
                <div className="flex flex-wrap gap-1">
                    {/* limit to two tags */}
                    {value.slice(0, 2).map((category: Category) => (
                        <CategoryBadge key={category.id} category={category} />
                    ))}
                </div>
            );
        },
    },
    {
        accessorKey: "account",
        header: "Account",
    },
    {
        accessorKey: "date_posted",
        header: "Date Posted",
    },
];
