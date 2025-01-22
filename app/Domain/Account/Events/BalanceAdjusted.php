<?php

namespace App\Domain\Account\Events;

use Spatie\EventSourcing\StoredEvents\ShouldBeStored;

class BalanceAdjusted extends ShouldBeStored
{
    public function __construct(
        public int $amount,
    ) {}
}
