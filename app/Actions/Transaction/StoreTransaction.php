<?php

declare(strict_types=1);

namespace App\Actions\Transaction;

use App\Http\Requests\Transaction\StoreTransactionRequest;
use App\Models\Transaction;
use Illuminate\Support\Facades\DB;

final class StoreTransaction
{
    public function handle(StoreTransactionRequest $args): Transaction
    {
        return DB::transaction(function () use ($args) {
            $transaction = Transaction::create([
                'account_id'  => $args->account_id,
                'category_id' => $args->category_id,
                'amount'      => $args->amount,
                'currency'    => $args->amount->currency,
                'type'        => $args->type,
                'date'        => $args->date,
                'memo'        => $args->memo,
            ]);

            $account = $transaction->account;

            $account->balance = $account->balance->add($transaction->amount);

            $account->save();

            return $transaction;
        });
    }
}
