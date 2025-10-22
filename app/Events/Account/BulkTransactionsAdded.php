<?php

declare(strict_types=1);

namespace App\Events\Account;

use App\Events\Contracts\ShouldUpdateAccountBalance;
use App\ValueObjects\Money;
use Illuminate\Contracts\Events\ShouldDispatchAfterCommit;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

final class BulkTransactionsAdded implements ShouldDispatchAfterCommit, ShouldUpdateAccountBalance
{
    use Dispatchable, SerializesModels;

    public function __construct(
        private readonly string $accountId,
        private readonly Money $amount,
    ) {}

    public function accountId(): string
    {
        return $this->accountId;
    }

    public function amount(): Money
    {
        return $this->amount;
    }
}
