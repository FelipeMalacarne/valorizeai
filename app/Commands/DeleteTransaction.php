<?php

namespace App\Commands;

use App\Aggregates\TransactionAggregate;
use Spatie\EventSourcing\Commands\AggregateUuid;
use Spatie\EventSourcing\Commands\HandledBy;

#[HandledBy(TransactionAggregate::class)]
class DeleteTransaction
{
    public function __construct(
        #[AggregateUuid] public string $id,
    ) {}
}
