import { DatePickerWithRange } from "@/components/date-range-picker";
import { Button } from "@/components/ui/button";
import { Tabs } from "@/components/ui/tabs";
import {
    Category,
    PageProps,
    PaginatedResource,
    Resource,
    Transaction,
} from "@/types";
import { File } from "lucide-react";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import TransactionsTable from "./components/TransactionsTable";
import AppLayout from "@/layouts/app-layout";
import { Crumb } from "@/components/breadcrumbs";

export type TransactionIndexProps = {
    transactions: PaginatedResource<Transaction>;
    categories: Resource<Category[]>;
};

export default function Index(props: PageProps<TransactionIndexProps>) {
    console.log(props.transactions);
    console.log(props.categories);

    const [date, setDate] = useState<DateRange | undefined>({
        from: undefined,
        to: undefined,
    });

    const breadcrumbs: Crumb[] = [
        { label: "Minhas Transações", href: route("transactions.index") },
    ];

    return (
        <>
            <AppLayout breadcrumbs={breadcrumbs}>
                {/* <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" /> */}

                <TransactionsTable transactions={props.transactions} />

                <div className="flex-1 space-y-8 p-8 pt-6">
                    <div className="space-y-4">
                        <main className="grid flex-1 items-start gap-4 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
                            {/* <SelectedTransactionProvider> */}
                            <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
                                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
                                    {/* <AddTransactionCard />
                                <WeeklyCard />
                                <MonthlyCard /> */}
                                </div>
                                <Tabs defaultValue="all">
                                    <div className="flex items-center">
                                        {/* <TabsList>
                                        <TabsTrigger value="all">
                                            Todas
                                        </TabsTrigger>
                                        <TabsTrigger value="credit">
                                            Entradas
                                        </TabsTrigger>
                                        <TabsTrigger value="debit">
                                            Saídas
                                        </TabsTrigger>
                                    </TabsList> */}

                                        <DatePickerWithRange
                                            date={date}
                                            setDate={setDate}
                                        />
                                        <div className="ml-auto flex items-center gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="h-7 gap-1 text-sm"
                                            >
                                                <File className="h-3.5 w-3.5" />
                                                <span className="sr-only sm:not-sr-only">
                                                    Export
                                                </span>
                                            </Button>
                                        </div>
                                    </div>

                                    {/* <AllTab />
                                <DebitTab />
                                <CreditTab /> */}
                                </Tabs>
                            </div>

                            {/* <SingleTransactionCard /> */}
                            {/* </SelectedTransactionProvider> */}
                        </main>
                    </div>
                </div>
            </AppLayout>
        </>
    );
}
