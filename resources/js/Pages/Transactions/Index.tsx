import PrimaryButton from '@/Components/PrimaryButton';
import { Button } from '@/Components/ui/button';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Index() {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Transactions
                </h2>
            }
        >

            <div className="space-y-4">
                <main className="grid flex-1 items-start gap-4 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
                   {/* <SelectedTransactionProvider> */}
                        <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
                            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
                            <Button>
                                teste
                            </Button>
                                {/* <AddTransactionCard /> */}
                                {/* <WeeklyCard /> */}
                                {/* <MonthlyCard /> */}
                            </div>
                            {/* <Tabs defaultValue="all"> */}
                                <div className="flex items-center">
                                    {/* <TabsList> */}
                                    {/*     <TabsTrigger value="all">Todas</TabsTrigger> */}
                                    {/*     <TabsTrigger value="credit">Entradas</TabsTrigger> */}
                                    {/*     <TabsTrigger value="debit">Saídas</TabsTrigger> */}
                                    {/* </TabsList> */}

                                    <div className="ml-auto flex items-center gap-2">
                                        {/* <Button */}
                                        {/*     size="sm" */}
                                        {/*     variant="outline" */}
                                        {/*     className="h-7 gap-1 text-sm" */}
                                        {/* > */}
                                        {/*     <File className="h-3.5 w-3.5" /> */}
                                        {/*     <span className="sr-only sm:not-sr-only">Export</span> */}
                                        {/* </Button> */}
                                    </div>
                                </div>

                                {/* <AllTab /> */}
                                {/* <DebitTab /> */}
                                {/* <CreditTab /> */}

                            {/* </Tabs> */}

                        </div>

                        {/* <SingleTransactionCard /> */}

                    {/* </SelectedTransactionProvider> */}
                </main>

            </div>

        </AuthenticatedLayout>
    );
}
