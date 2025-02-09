import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Account, PageProps, PaginatedResource } from "@/types";
import { AccountCard } from "./Components/AccountCard";
import CreateAccountSheet from "./Components/CreateAccountSheet";

export type AccountIndexProps = {
    accounts: PaginatedResource<Account>;
    colors: string[];
};

export default function Index(props: PageProps<AccountIndexProps>) {
    return (
        <div className="space-y-4 mt-2">
            <div className="flex justify-between items-center gap-2">
                <h2 className="text-3xl font-bold tracking-tight p-3 self-start">
                    Contas Bancárias
                </h2>

                <CreateAccountSheet />
            </div>

            <div>
                <div className="flex flex-wrap justify-center gap-4">
                    {props.accounts.data.map((account) => (
                        <AccountCard key={account.id} account={account} />
                    ))}
                </div>
            </div>
        </div>
    );
}

Index.layout = (page: any) => (
    <AuthenticatedLayout
        children={page}
        breadcrumbs={[
            { label: "Contas Bancárias", href: route("accounts.index") },
        ]}
    />
);
