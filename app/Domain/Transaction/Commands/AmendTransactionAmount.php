<?php

declare(strict_types=1);

namespace App\Domain\Transaction\Commands;

use App\Domain\Transaction\TransactionAggregate;
use Spatie\EventSourcing\Commands\AggregateUuid;
use Spatie\EventSourcing\Commands\HandledBy;

#[HandledBy(TransactionAggregate::class)]
final class AmendTransactionAmount
{
    public function __construct(
        #[AggregateUuid] public string $id,
        public int $amount,
    ) {}
}
