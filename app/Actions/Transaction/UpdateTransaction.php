<?php

declare(strict_types=1);

namespace App\Actions\Transaction;

use App\Enums\TransactionType;
use App\Http\Requests\Transaction\UpdateTransactionRequest;
use App\Models\Transaction;
use Illuminate\Support\Facades\DB;
use App\Events\Transaction\TransactionUpdated;

final class UpdateTransaction
{
    public function handle(UpdateTransactionRequest $data, Transaction $transaction): Transaction
    {
        return DB::transaction(function () use ($data, $transaction) {
            $oldTransaction = $transaction->replicate(); // Store the old state

            // Update the transaction with new data
            $transaction->amount = $data->amount;
            $transaction->type = $data->amount->value >= 0 ? TransactionType::CREDIT : TransactionType::DEBIT;
            $transaction->date = $data->date;
            $transaction->memo = $data->memo;
            $transaction->category_id = $data->category_id;
            $transaction->save();

            TransactionUpdated::dispatch($oldTransaction, $transaction);

            return $transaction;
        });
    }
}
