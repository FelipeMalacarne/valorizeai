import { Account, PageProps, PaginatedResource } from "@/types";
import CreateAccountSheet from "./components/create-account-sheet";
import { AccountCard } from "./components/account-card";
import AppLayout from "@/layouts/app-layout";
import { Crumb } from "@/components/breadcrumbs";
import { Link } from "@inertiajs/react";

export type AccountIndexProps = {
  accounts: PaginatedResource<Account>;
  colors: string[];
};

const breadcrumbs: Crumb[] = [
  { label: "Contas Bancárias", href: route("accounts.index") },
];

export default function Index(props: PageProps<AccountIndexProps>) {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
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
                <Link prefetch preserveState key={account.id} href={route("accounts.show", account.id)}>
                  <AccountCard key={account.id} account={account} />
                </Link>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
