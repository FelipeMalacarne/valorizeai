<?php

namespace App\Domain\Transaction\Commands;

use App\Domain\Transaction\TransactionAggregate;
use Spatie\EventSourcing\Commands\AggregateUuid;
use Spatie\EventSourcing\Commands\HandledBy;

#[HandledBy(TransactionAggregate::class)]
class DeleteTransaction
{
    public function __construct(
        #[AggregateUuid] public string $id,
    ) {}
}
