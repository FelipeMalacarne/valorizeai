import { Crumb } from "@/components/breadcrumbs";
import AppLayout from "@/layouts/app-layout";
import AuthenticatedLayout from "@/layouts/AuthenticatedLayout";
import { Account, PageProps } from "@/types";

export type AccountShowProps = {
    account: Account;
};

export default function Show({ account }: PageProps<AccountShowProps>) {
    const breadcrumbs: Crumb[] = [
        { label: "Contas Bancárias", href: route("accounts.index") },
        { label: account.name, href: route("accounts.show", { id: account.id }) },
    ];
    return (
        <>
            <AppLayout breadcrumbs={breadcrumbs}>
                <h2 className="text-3xl font-bold tracking-tight p-3 self-start">
                    {account.name}
                </h2>
            </AppLayout>
        </>
    );
}
