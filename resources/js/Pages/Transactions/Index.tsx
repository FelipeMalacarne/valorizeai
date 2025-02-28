import { DatePickerWithRange } from "@/Components/DateRangePicker";
import { Button } from "@/Components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { PageProps, PaginatedResource, Transaction } from "@/types";
import { addDays } from "date-fns";
import { File } from "lucide-react";
import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import TransactionsTable from "./Components/TransactionsTable";
import { router } from "@inertiajs/react";

export type TransactionIndexProps = {
    transactions: PaginatedResource<Transaction>;
};

export default function Index(props: PageProps<TransactionIndexProps>) {
    console.log(props.transactions);

    const [date, setDate] = useState<DateRange | undefined>({
        from: undefined,
        to: undefined,
    });


    return (
        <>
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
        </>
    );
}

Index.layout = (page: any) => (
    <AuthenticatedLayout
        children={page}
        breadcrumbs={[
            { label: "Minhas Transações", href: route("transactions.index") },
        ]}
    />
);
