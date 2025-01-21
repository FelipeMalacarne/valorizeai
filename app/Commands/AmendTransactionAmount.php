<?php

namespace App\Commands;

use App\Aggregates\TransactionAggregate;
use Spatie\EventSourcing\Commands\AggregateUuid;
use Spatie\EventSourcing\Commands\HandledBy;

#[HandledBy(TransactionAggregate::class)]
class AmendTransactionAmount
{
    public function __construct(
        #[AggregateUuid] public string $id,
        public int $amount,
    ) {}
}
