import { useNotifications } from '@/hooks/use-notifications';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Bell, CheckCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

const EMPTY_STATE_MESSAGE = 'Sem novas notificações.';

export function NotificationBell() {
    const { items, unreadCount, hasUnread, markAllAsRead, isMarking } = useNotifications();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {hasUnread && (
                        <span className="bg-destructive text-destructive-foreground absolute -right-1 -top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-semibold leading-none">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 p-0">
                <div className="flex items-center justify-between gap-2 px-4 py-3">
                    <div>
                        <p className="text-sm font-semibold">Notificações</p>
                        <p className="text-xs text-muted-foreground">Acompanhe os últimos acontecimentos da sua conta.</p>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        disabled={!hasUnread || isMarking}
                        onClick={markAllAsRead}
                        title="Marcar todas como lidas"
                    >
                        <CheckCheck className="h-4 w-4" />
                        <span className="sr-only">Marcar como lidas</span>
                    </Button>
                </div>
                <DropdownMenuSeparator />
                <div className="max-h-80 overflow-y-auto">
                    {items.length === 0 ? (
                        <div className="px-4 py-8 text-center text-sm text-muted-foreground">{EMPTY_STATE_MESSAGE}</div>
                    ) : (
                        items.map((notification) => {
                            const createdAt = notification.created_at
                                ? new Date(notification.created_at)
                                : new Date();
                            const timeAgo = formatDistanceToNow(createdAt, { addSuffix: true, locale: ptBR });
                            const title =
                                (notification.data as any)?.title ?? (notification.data as any)?.message ?? 'Nova notificação';
                            const body =
                                (notification.data as any)?.body ??
                                (notification.data as any)?.description ??
                                (notification.data as any)?.message ??
                                null;

                            return (
                                <div
                                    key={notification.id}
                                    className={cn(
                                        'flex flex-col gap-1 px-4 py-3 transition-colors',
                                        !notification.read_at ? 'bg-muted/60' : 'hover:bg-muted/40',
                                    )}
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <p className="text-sm font-semibold leading-snug">{title}</p>
                                        {!notification.read_at && <Badge variant="destructive">Novo</Badge>}
                                    </div>
                                    {body && <p className="text-xs text-muted-foreground">{body}</p>}
                                    <span className="text-xs text-muted-foreground">{timeAgo}</span>
                                </div>
                            );
                        })
                    )}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
