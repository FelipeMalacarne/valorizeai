<?php

declare(strict_types=1);

namespace App\Events\Transaction;

use App\Events\Contracts\ShouldUpdateAccountBalance;
use App\Models\Transaction;
use App\ValueObjects\Money;
use Illuminate\Contracts\Events\ShouldDispatchAfterCommit;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

final class TransactionCreated implements ShouldDispatchAfterCommit, ShouldUpdateAccountBalance
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public Transaction $transaction,
    ) {}

    public function accountId(): string
    {
        return (string) $this->transaction->account_id;
    }

    public function amount(): Money
    {
        return $this->transaction->amount;
    }
}
