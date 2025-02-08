import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { ErrorResponse, PageProps } from "@/types";

export default function Create({
    colors,
}: PageProps<{
    colors: string[];
}>) {
    return <div></div>;
}

Create.layout = (page: any) => (
    <AuthenticatedLayout
        children={page}
        breadcrumbs={[
            { label: "Contas Bancárias", href: route("accounts.index") },
            { label: "Criar Nova Conta", href: route("accounts.create") },
        ]}
    />
);
