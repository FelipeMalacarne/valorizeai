import axios from 'axios';
import { usePage } from '@inertiajs/react';
import { useEffect, useMemo, useState, useCallback } from 'react';
import { useEchoNotification } from '@laravel/echo-react';
import type { SharedData } from '@/types';

type NotificationList = App.Http.Resources.NotificationResource[];

type UseNotificationsOptions = {
    items?: NotificationList;
    unreadCount?: number;
};

export function useNotifications(initialData?: UseNotificationsOptions) {
    const {
        auth: { user },
        notifications,
    } = usePage<SharedData>().props;

    const initialItems = useMemo<NotificationList>(
        () => initialData?.items ?? notifications?.items ?? [],
        [initialData?.items, notifications?.items],
    );

    const initialUnread = useMemo<number>(
        () => initialData?.unreadCount ?? notifications?.unread_count ?? 0,
        [initialData?.unreadCount, notifications?.unread_count],
    );

    if (!user) {
        return {
            items: initialItems,
            unreadCount: initialUnread,
            hasUnread: initialUnread > 0,
            markAllAsRead: async () => {},
            isMarking: false,
        } as const;
    }

    const [items, setItems] = useState<NotificationList>(initialItems);
    const [unreadCount, setUnreadCount] = useState<number>(initialUnread);
    const [isMarking, setIsMarking] = useState(false);

    useEffect(() => {
        setItems(initialItems);
        setUnreadCount(initialUnread);
    }, [initialItems, initialUnread]);

    const channelName = useMemo(() => `App.Models.User.${user.id}`, [user.id]);

    useEchoNotification<any>(
        channelName,
        (notification) => {
            const raw = notification ?? {};
            const payloadData = raw.data ?? raw;

            const normalized: App.Http.Resources.NotificationResource = {
                id: String(raw.id ?? crypto.randomUUID()),
                type: raw.type ?? null,
                data: payloadData?.data ?? payloadData ?? {},
                read_at: raw.read_at ?? null,
                created_at: raw.created_at ?? new Date().toISOString(),
            };

            setItems((current) => [normalized, ...current].slice(0, 15));
            setUnreadCount((current) => current + 1);
        },
        undefined,
        [channelName],
    );

    const markAllAsRead = useCallback(async () => {
        if (isMarking || unreadCount === 0) return;

        try {
            setIsMarking(true);
            const response = await axios.post(route('notifications.read'));
            setItems((current) =>
                current.map((notification) => ({
                    ...notification,
                    read_at: notification.read_at ?? new Date().toISOString(),
                })),
            );
            setUnreadCount(response.data?.unread_count ?? 0);
        } catch (error) {
            console.error('Failed to mark notifications as read', error);
        } finally {
            setIsMarking(false);
        }
    }, [isMarking, unreadCount]);

    return {
        items,
        unreadCount,
        hasUnread: unreadCount > 0,
        markAllAsRead,
        isMarking,
    };
}
