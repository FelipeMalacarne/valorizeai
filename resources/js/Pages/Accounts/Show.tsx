import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Account, PageProps } from "@/types";

export type AccountShowProps = {
    account: Account;
};

export default function Show({ account }: PageProps<AccountShowProps>) {
    return (
        <>
            <h2 className="text-3xl font-bold tracking-tight p-3 self-start">
                {account.name}
            </h2>
        </>
    );
}

Show.layout = (page: any) => (
    <AuthenticatedLayout
        children={page}
        breadcrumbs={[
            { label: "Contas Bancárias", href: route("accounts.index") },
            { label: page.props.account.name },
        ]}
    />
);
