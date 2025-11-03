import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, SharedData } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useMemo } from 'react';
import { useNotifications } from '@/hooks/use-notifications';
import { cn } from '@/lib/utils';

type NotificationsIndexProps = {
    notifications: {
        data: App.Http.Resources.NotificationResource[];
        links: { url: string | null; label: string; active: boolean }[];
        current_page: number;
        last_page: number;
    };
    unread_count: number;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Notificações',
        href: route('notifications.index'),
    },
];

const NotificationsIndex = (props: SharedData<NotificationsIndexProps>) => {
    const paginator = props.notifications;

    const {
        items,
        unreadCount,
        hasUnread,
        markAllAsRead,
        isMarking,
    } = useNotifications({
        items: paginator?.data ?? [],
        unreadCount: props.unread_count,
    });

    const paginationLinks = useMemo(() => paginator?.links ?? [], [paginator?.links]);

    const handleNavigate = (url: string | null) => {
        if (!url) return;
        router.get(url, {}, { preserveScroll: true, preserveState: true });
    };

    return (
        <>
            <Head title="Notificações" />
            <div className="container mx-auto flex h-full flex-1 flex-col space-y-6 p-4">
                <Card>
                    <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <CardTitle>Notificações</CardTitle>
                            <p className="text-muted-foreground text-sm">
                                Acompanhe os últimos eventos da sua conta. Novas notificações chegam em tempo real.
                            </p>
                        </div>
                        <Button variant="outline" size="sm" disabled={!hasUnread || isMarking} onClick={markAllAsRead}>
                            Marcar todas como lidas
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {items.length === 0 ? (
                            <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
                                Nenhuma notificação por aqui ainda.
                            </div>
                        ) : (
                            <ul className="space-y-3">
                                {items.map((notification) => {
                                    const createdAt = notification.created_at
                                        ? new Date(notification.created_at)
                                        : new Date();

                                    const timeAgo = formatDistanceToNow(createdAt, { addSuffix: true, locale: ptBR });
                                    const title =
                                        (notification.data as any)?.title ??
                                        (notification.data as any)?.message ??
                                        'Nova notificação';
                                    const body =
                                        (notification.data as any)?.body ??
                                        (notification.data as any)?.description ??
                                        (notification.data as any)?.message ??
                                        null;

                                    return (
                                        <li
                                            key={notification.id}
                                            className={cn(
                                                'rounded-lg border p-4 transition-colors',
                                                !notification.read_at ? 'border-primary/40 bg-primary/5' : 'bg-card',
                                            )}
                                        >
                                            <div className="flex flex-col gap-2">
                                                <div className="flex items-start justify-between gap-3">
                                                    <div>
                                                        <p className="text-sm font-semibold text-foreground">{title}</p>
                                                        {body && <p className="text-sm text-muted-foreground">{body}</p>}
                                                    </div>
                                                    {!notification.read_at && <Badge variant="destructive">Novo</Badge>}
                                                </div>
                                                <span className="text-xs text-muted-foreground">{timeAgo}</span>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}

                        <div className="flex items-center justify-between border-t pt-4 text-sm text-muted-foreground">
                            <span>
                                {unreadCount > 0
                                    ? `${unreadCount} ${unreadCount === 1 ? 'notificação não lida' : 'notificações não lidas'}`
                                    : 'Todas as notificações foram lidas.'}
                            </span>
                            <div className="flex items-center gap-2">
                                {paginationLinks.map((link, index) => {
                                    const label = link.label.replace('&laquo;', '«').replace('&raquo;', '»');
                                    return (
                                        <Button
                                            key={`${label}-${index}`}
                                            variant={link.active ? 'default' : 'outline'}
                                            size="sm"
                                            disabled={!link.url}
                                            onClick={() => handleNavigate(link.url)}
                                        >
                                            {label}
                                        </Button>
                                    );
                                })}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
};

NotificationsIndex.layout = (page: React.ReactNode) => <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>;

export default NotificationsIndex;
