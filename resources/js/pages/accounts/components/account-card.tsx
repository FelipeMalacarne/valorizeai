import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { getAccountIcon, getAccountTypeColor } from '@/lib/accounts';
import { Link } from '@inertiajs/react';
import { Edit, Eye, MoreHorizontal } from 'lucide-react';

export function AccountCard({ account }: { account: App.Http.Resources.AccountResource }) {
    const Icon = getAccountIcon(account.type);
    return (
        <Card
            key={account.id}
            className="hover:border-l-primary cursor-pointer border-l-4 border-l-transparent transition-all duration-200 hover:shadow-lg shadow-sm"
        >
            <Link href={route('accounts.show', account.id)}>
                <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                            <Avatar className="h-12 w-12">
                                <AvatarFallback className={getAccountTypeColor(account.type)}>
                                    <Icon className="h-6 w-6" />
                                </AvatarFallback>
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
            </Link>
        </Card>
    );
}
