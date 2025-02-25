import { CategoryBadge } from "@/Components/CategoryBadge";
import { Badge } from "@/Components/ui/badge";
import { Category, Transaction } from "@/types";
import { ColumnDef } from "@tanstack/react-table";

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
    },
    {
        accessorKey: "currency",
        header: "Currency",
    },
    {
        accessorKey: "amount",
        header: "Amount",
    },
    {
        accessorKey: "fitid",
        header: "Fit ID",
    },
    {
        accessorKey: "memo",
        header: "Memo",
    },
    {
        accessorKey: "categories",
        header: "Categories",
        cell: ({ row }) => {
            const value = row.getValue("categories") as Category[];
            return (
                <div className="flex flex-wrap gap-1">
                    {value.map((category: Category) => (
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
