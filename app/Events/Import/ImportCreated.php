<?php

declare(strict_types=1);

namespace App\Events\Import;

use App\Models\Import;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Contracts\Events\ShouldDispatchAfterCommit;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

final class ImportCreated implements ShouldBroadcast, ShouldDispatchAfterCommit
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public Import $import,
    ) {}

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel("user.{$this->import->user_id}.imports"),
        ];
    }

    public function broadcastAs(): string
    {
        return 'import.created';
    }
}
