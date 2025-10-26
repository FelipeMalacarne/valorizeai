<?php

declare(strict_types=1);

namespace App\Events\Transaction;

use App\Events\Contracts\ShouldUpdateAccountBalance;
use App\ValueObjects\Money;
use Illuminate\Contracts\Events\ShouldDispatchAfterCommit;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

final class TransactionDeleted implements ShouldDispatchAfterCommit, ShouldUpdateAccountBalance
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
        // When a transaction is destroyed, its amount should be subtracted from the balance.
        // So, we return the negative of the transaction amount.
        return $this->amount->multiply(-1);
    }
}
