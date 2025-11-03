<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Notifications\DatabaseNotification;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
final class NotificationResource extends Data
{
    /**
     * @param  array<string, mixed>  $data
     */
    public function __construct(
        public string $id,
        public ?string $type,
        public array $data,
        public ?string $read_at,
        public string $created_at,
    ) {}

    public static function fromModel(DatabaseNotification $notification): self
    {
        return new self(
            id: (string) $notification->id,
            type: $notification->type,
            data: $notification->data ?? [],
            read_at: optional($notification->read_at)?->toIso8601String(),
            created_at: optional($notification->created_at)?->toIso8601String() ?? now()->toIso8601String(),
        );
    }
}
