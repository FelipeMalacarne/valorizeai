<?php

namespace App\Domain\Transaction\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Spatie\EventSourcing\StoredEvents\ShouldBeStored;

class AmountAmended extends ShouldBeStored
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public string $accountId,
        public int $amount,
        public int $oldAmount,
    ) {}

    public function difference(): int
    {
        return $this->amount - $this->oldAmount;
    }
}
