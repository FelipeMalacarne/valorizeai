<?php

declare(strict_types=1);

namespace App\Domain\Account\Commands;

use App\Domain\Account\AccountAggregate;
use Spatie\EventSourcing\Commands\AggregateUuid;
use Spatie\EventSourcing\Commands\HandledBy;

#[HandledBy(AccountAggregate::class)]
final class AdjustAccountBalance
{
    public function __construct(
        #[AggregateUuid] public string $id,
        public int $amount,
    ) {}
}
