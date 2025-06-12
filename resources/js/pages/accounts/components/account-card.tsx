import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { CreditCard, Edit, Eye, MoreHorizontal, PiggyBank, TrendingUp, Wallet } from 'lucide-react';

export function AccountCard({ account }: { account: App.Http.Resources.AccountResource }) {
    const getAccountTypeColor = (type: App.Enums.AccountType) => {
        switch (type) {
            case 'checking':
                return 'bg-chart-2/10 text-chart-2 border-chart-2/20';
            case 'savings':
                return 'bg-chart-3/10 text-chart-3 border-chart-3/20';
            case 'credit':
                return 'bg-chart-4/10 text-chart-4 border-chart-4/20';
            case 'investment':
                return 'bg-chart-5/10 text-chart-5 border-chart-5/20';
            default:
                return 'bg-chart-1/10 text-chart-1 border-chart-1/20';
        }
    };
    const getAccountIcon = (type: App.Enums.AccountType) => {
        switch (type) {
            case 'checking':
                return <Wallet className="h-5 w-5" />;
            case 'savings':
                return <PiggyBank className="h-5 w-5" />;
            case 'credit':
                return <CreditCard className="h-5 w-5" />;
            case 'investment':
                return <TrendingUp className="h-5 w-5" />;
            default:
                return <Wallet className="h-5 w-5" />;
        }
    };
    return (
        <Card
            key={account.id}
            className="hover:border-l-primary cursor-pointer border-l-4 border-l-transparent transition-all duration-200 hover:shadow-lg max-w-sm shadow-sm"
        >
            <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                            <AvatarFallback className={getAccountTypeColor(account.type)}>{getAccountIcon(account.type)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <CardTitle className="text-lg">{account.name}</CardTitle>
                            <p className="text-sm text-muted-foreground">
                                {account.bank.name}
                                {account.number && ` •••• ${account.number.slice(-4)}`}
                            </p>
                        </div>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem
                                onClick={(e) => {
                                    e.stopPropagation();
                                    // handleViewAccount(account);
                                }}
                            >
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={(e) => {
                                    e.stopPropagation();
                                    // handleEditAccount(account);
                                }}
                            >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Account
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between">
                    <Badge variant="secondary" className={`${getAccountTypeColor(account.type)} border`}>
                        {account.type.charAt(0).toUpperCase() + account.type.slice(1)}
                    </Badge>
                    <Badge variant="outline">{account.currency}</Badge>
                </div>
            </CardContent>
        </Card>
    );
}
