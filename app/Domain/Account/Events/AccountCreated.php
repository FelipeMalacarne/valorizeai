<?php

namespace App\Domain\Account\Events;

use App\Domain\Account\Enums\Color;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Spatie\EventSourcing\StoredEvents\ShouldBeStored;

class AccountCreated extends ShouldBeStored
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public string $name,
        public Color $color,
        public string $userId,
        public ?string $type = null,
        public ?string $number = null,
        public ?string $description = null,
    ) {}
}
