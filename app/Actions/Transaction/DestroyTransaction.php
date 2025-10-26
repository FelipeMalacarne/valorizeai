<?php

declare(strict_types=1);

namespace App\Actions\Transaction;

use App\Events\Transaction\TransactionDeleted;
use App\Models\Transaction;
use Illuminate\Support\Facades\DB;

final class DestroyTransaction
{
    public function handle(Transaction $transaction): bool
    {
        return DB::transaction(function () use ($transaction) {
            TransactionDeleted::dispatch($transaction->account_id, $transaction->amount);

            return $transaction->delete();
        });
    }
}
