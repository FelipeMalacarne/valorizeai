<?php

declare(strict_types=1);

namespace App\Services\Statement\Data;

use App\Enums\Currency;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Spatie\LaravelData\Data;

final class StatementData extends Data
{
    /**
     * @param  Collection<int, TransactionData>  $transactions
     */
    public function __construct(
        public Carbon $startDate,
        public Carbon $endDate,
        public Collection $transactions,
        public BankAccountData $bankAccount,
        public Currency $currency,
    ) {}
}
