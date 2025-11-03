import axios from 'axios';
import { usePage } from '@inertiajs/react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { echo } from '@laravel/echo-react';
import type { SharedData } from '@/types';

const MAX_ITEMS = 15;

type NotificationList = App.Http.Resources.NotificationResource[];

type UseNotificationsOptions = {
    items?: NotificationList;
    unreadCount?: number;
};

export function useNotifications(initialData: UseNotificationsOptions = {}) {
    const {
        auth: { user },
        notifications,
    } = usePage<SharedData>().props;

    const fallbackItems = notifications?.items ?? [];
    const fallbackUnread = notifications?.unread_count ?? 0;

    const initialItems = useMemo<NotificationList>(
        () => initialData.items ?? fallbackItems,
        [initialData.items, fallbackItems],
    );

    const initialUnread = useMemo<number>(
        () => initialData.unreadCount ?? fallbackUnread,
        [initialData.unreadCount, fallbackUnread],
    );

    const [items, setItems] = useState<NotificationList>(initialItems);
    const [unreadCount, setUnreadCount] = useState<number>(initialUnread);
    const [isMarking, setIsMarking] = useState(false);

    useEffect(() => {
        setItems(initialItems);
    }, [initialItems]);

    useEffect(() => {
        setUnreadCount(initialUnread);
    }, [initialUnread]);

    useEffect(() => {
        if (!user) {
            return;
        }

        const channelName = `App.Models.User.${user.id}`;
        const echoInstance = echo();

        if (!echoInstance) {
            return;
        }

        const channel = echoInstance.private(channelName);

        const handler = (notification: any) => {
            const raw = notification ?? {};
            const payloadData = raw.data ?? raw;

            const normalized: App.Http.Resources.NotificationResource = {
                id: String(raw.id ?? payloadData?.id ?? crypto.randomUUID()),
                type: raw.type ?? null,
                data: payloadData?.data ?? payloadData ?? {},
                read_at: raw.read_at ?? null,
                created_at: raw.created_at ?? new Date().toISOString(),
            };

            setItems((current) => [normalized, ...current].slice(0, MAX_ITEMS));
            setUnreadCount((current) => current + 1);
        };

        channel.notification(handler);

        return () => {
            channel.stopListening('.Illuminate\\Notifications\\Events\\BroadcastNotificationCreated', handler);
            echoInstance.leave(channelName);
        };
    }, [user?.id]);

    const markAllAsRead = useCallback(async () => {
        if (!user || isMarking || unreadCount === 0) return;

        try {
            setIsMarking(true);
            const response = await axios.post(route('notifications.read'));
            const unread = response.data?.unread_count ?? 0;

            setItems((current) =>
                current.map((notification) => ({
                    ...notification,
                    read_at: notification.read_at ?? new Date().toISOString(),
                })),
            );
            setUnreadCount(unread);
        } catch (error) {
            console.error('Failed to mark notifications as read', error);
        } finally {
            setIsMarking(false);
        }
    }, [user?.id, isMarking, unreadCount]);

    return {
        items,
        unreadCount,
        hasUnread: unreadCount > 0,
        markAllAsRead,
        isMarking,
    } as const;
}
