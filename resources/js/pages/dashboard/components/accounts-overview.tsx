import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getAccountIcon, getAccountTypeColor } from '@/lib/accounts';

type AccountsOverviewProps = {
    accounts: App.Http.Resources.AccountResource[];
};

export const AccountsOverview = ({ accounts }: AccountsOverviewProps) => (
    <Card className="h-full">
        <CardHeader>
            <CardTitle>Contas</CardTitle>
            <CardDescription>Saldo atual por conta conectada.</CardDescription>
        </CardHeader>
        <CardContent className="px-0">
            <div className="max-h-[320px] overflow-y-auto">
                <div className="flex flex-col divide-y">
                    {accounts.map((account) => {
                        const Icon = getAccountIcon(account.type);
                        return (
                            <div key={account.id} className="flex items-center justify-between px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-8 w-8">
                                        <AvatarFallback className={getAccountTypeColor(account.type)}>
                                            <Icon className="h-4 w-4" />
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="text-sm font-medium leading-none">{account.name}</p>
                                        <p className="text-xs text-muted-foreground">{account.bank.name}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-sm">{account.balance.formatted}</p>
                                    <Badge variant="outline" className="mt-1 text-[10px] uppercase tracking-wide">
                                        {account.currency}
                                    </Badge>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </CardContent>
    </Card>
);
