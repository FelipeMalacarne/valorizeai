<?php

declare(strict_types=1);

namespace App\Events\Transaction;

use App\Events\Contracts\ShouldUpdateAccountBalance;
use App\Models\Transaction;
use App\ValueObjects\Money;
use Illuminate\Contracts\Events\ShouldDispatchAfterCommit;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

final class TransactionUpdated implements ShouldDispatchAfterCommit, ShouldUpdateAccountBalance
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public Transaction $oldTransaction,
        public Transaction $newTransaction,
    ) {}

    public function accountId(): string
    {
        return (string) $this->newTransaction->account_id;
    }

    public function amount(): Money
    {
        // The change in balance is new amount - old amount
        return $this->newTransaction->amount->subtract($this->oldTransaction->amount);
    }
}
