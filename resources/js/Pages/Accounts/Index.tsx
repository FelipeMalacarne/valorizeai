import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Account, PageProps, PaginatedResource } from "@/types";
import { AccountCard } from "./Components/AccountCard";

export default function Index({
    accounts,

}: PageProps<{
    accounts: PaginatedResource<Account>
}>) {
    console.log(accounts.data);

    return (
        <div className="flex-1 space-y-8 p-8 pt-6">
            <div className="flex items-center justify-between">

                <h2 className="text-3xl font-bold tracking-tight">Contas Bancárias</h2>
                {/* <NewAccountSheet /> */}

            </div>

            <div className="space-y-4">

                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                    {accounts.data.map(account => (
                        <AccountCard key={account.id} account={account}/>
                    ))}
                </div>

            </div>

        </div>
    )
}

Index.layout = (page: any) => <AuthenticatedLayout children={page} />;

