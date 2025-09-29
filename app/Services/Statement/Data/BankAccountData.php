<?php

declare(strict_types=1);

namespace App\Services\Statement\Data;

use App\Enums\AccountType;
use Carbon\Carbon;
use Spatie\LaravelData\Data;

final class BankAccountData extends Data
{
    public function __construct(
        public readonly AccountType $type,
        public readonly string $bankId,
        public readonly string $bankName,
        public readonly string $agencyNumber,
        public readonly string $number,
        public readonly float $balance,
        public readonly Carbon $balanceDate,
    ) {}
}
