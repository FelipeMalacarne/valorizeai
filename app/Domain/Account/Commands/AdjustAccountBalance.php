<?php

namespace App\Domain\Account\Commands;

use App\Domain\Account\AccountAggregate;
use Spatie\EventSourcing\Commands\AggregateUuid;
use Spatie\EventSourcing\Commands\HandledBy;

#[HandledBy(AccountAggregate::class)]
class AdjustAccountBalance
{
    public function __construct(
        #[AggregateUuid] public string $accountId,
        public int $amount,
    ) {}
}
