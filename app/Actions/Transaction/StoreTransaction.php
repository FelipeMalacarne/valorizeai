<?php

declare(strict_types=1);

namespace App\Actions\Transaction;

use App\Http\Requests\Transaction\StoreTransactionRequest;
use App\Models\Transaction;
use Illuminate\Support\Facades\DB;

final class StoreTransaction
{
    public function handle(StoreTransactionRequest $request): Transaction
    {
        return DB::transaction(fn () => Transaction::create($request->all()));
    }
}
