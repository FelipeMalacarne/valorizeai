<?php

declare(strict_types=1);

namespace App\Actions\Transaction;

use App\Http\Requests\Transaction\UpdateTransactionRequest;
use App\Models\Transaction;
use Illuminate\Support\Facades\DB;

final class UpdateTransaction
{
    public function handle(UpdateTransactionRequest $data, Transaction $transaction): Transaction
    {
        return DB::transaction(function () use ($data, $transaction) {
            $account = $transaction->account;

            // Revert the old transaction amount from the account balance
            $account->balance = $account->balance->subtract($transaction->amount);

            // Update the transaction with new data
            $transaction->amount = $data->amount;
            $transaction->type = $data->type;
            $transaction->date = $data->date;
            $transaction->memo = $data->memo;
            $transaction->category_id = $data->category_id;
            $transaction->save();

            // Apply the new transaction amount to the account balance
            $account->balance = $account->balance->add($transaction->amount);
            $account->save();

            return $transaction;
        });
    }
}
