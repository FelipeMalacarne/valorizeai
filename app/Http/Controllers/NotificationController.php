<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Resources\NotificationResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

final class NotificationController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        abort_unless($user, 403);
        $notifications = $user->notifications()
            ->latest()
            ->paginate(20)
            ->through(fn ($notification) => NotificationResource::fromModel($notification)->toArray());

        return Inertia::render('notifications/index', [
            'notifications' => $notifications,
            'unread_count'  => $user->unreadNotifications()->count(),
        ]);
    }

    public function markAllRead(Request $request): JsonResponse
    {
        $user = $request->user();

        abort_unless($user, 403);

        $user->unreadNotifications->markAsRead();

        return response()->json([
            'status'        => 'ok',
            'unread_count'  => $user?->unreadNotifications()->count() ?? 0,
        ]);
    }
}
