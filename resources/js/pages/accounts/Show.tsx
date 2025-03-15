import { Crumb } from "@/components/breadcrumbs";
import AppLayout from "@/layouts/app-layout";
import { Account, PageProps, Resource } from "@/types";

export type AccountShowProps = {
    account: Resource<Account>;
};

export default function Show({ account }: PageProps<AccountShowProps>) {
    const breadcrumbs: Crumb[] = [
        { label: "Contas Bancárias", href: route("accounts.index") },
        {
            label: account.data.name,
            href: route("accounts.show", { id: account.data.id }),
        },
    ];
    return (
        <>
            <AppLayout breadcrumbs={breadcrumbs}>
                <h2 className="text-3xl font-bold tracking-tight p-3 self-start">
                    {account.data.name}
                </h2>
            </AppLayout>
        </>
    );
}
