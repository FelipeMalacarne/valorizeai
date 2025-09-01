<?php

declare(strict_types=1);

namespace App\Actions\Transaction;

use App\Models\Transaction;
use Illuminate\Support\Facades\DB;

final class DestroyTransaction
{
    public function handle(Transaction $transaction): bool
    {
        return DB::transaction(function () use ($transaction) {
            $account = $transaction->account;

            $account->balance = $account->balance->subtract($transaction->amount);
            $account->save();

            return $transaction->delete();
        });
    }
}
