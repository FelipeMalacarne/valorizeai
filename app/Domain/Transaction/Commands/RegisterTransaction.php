<?php

declare(strict_types=1);

namespace App\Domain\Transaction\Commands;

use App\Domain\Transaction\TransactionAggregate;
use Illuminate\Support\Carbon;
use Spatie\EventSourcing\Commands\AggregateUuid;
use Spatie\EventSourcing\Commands\HandledBy;
use Spatie\LaravelData\Data;

#[HandledBy(TransactionAggregate::class)]
final class RegisterTransaction extends Data
{
    public function __construct(
        #[AggregateUuid] public string $id,
        public int $amount,
        public string $currency,
        public string $accountId,
        public ?string $fitid = null,
        public ?string $memo = null,
        public ?string $accountNumber = null,
        public Carbon $datePosted = new Carbon,
        public ?string $description = null,
    ) {}
}
