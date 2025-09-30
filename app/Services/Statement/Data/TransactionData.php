<?php

declare(strict_types=1);

namespace App\Services\Statement\Data;

use App\Enums\TransactionType;
use App\ValueObjects\Money;
use Carbon\Carbon;
use Spatie\LaravelData\Data;

final class TransactionData extends Data
{
    public function __construct(
        public TransactionType $type,
        public Carbon $date,
        public Money $amount,
        public string $memo,
        public string $fitid,
    ) {}
}
