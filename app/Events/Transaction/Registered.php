<?php

namespace App\Events\Transaction;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Spatie\EventSourcing\StoredEvents\ShouldBeStored;

class Registered extends ShouldBeStored
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public int $amount,
        public string $currency,
        public string $accountId,
        public ?string $fitid = null,
        public ?string $memo = null,
        public ?string $accountNumber = null,
        public ?\DateTime $datePosted = null
    ) {}
}
