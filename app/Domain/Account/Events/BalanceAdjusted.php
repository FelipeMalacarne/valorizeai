<?php

declare(strict_types=1);

namespace App\Domain\Account\Events;

use Spatie\EventSourcing\StoredEvents\ShouldBeStored;

final class BalanceAdjusted extends ShouldBeStored
{
    public function __construct(
        public int $amount,
    ) {}
}
