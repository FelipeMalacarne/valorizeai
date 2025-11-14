<?php

declare(strict_types=1);

namespace App\Actions\Account;

use App\Models\Account;
use App\ValueObjects\Money;
use Illuminate\Database\Eloquent\ModelNotFoundException;

final class UpdateAccountBalance
{
    public function handle(string $accountId, Money $amount): void
    {
        $updatedRows = Account::query()
            ->whereKey($accountId)
            ->where('currency', $amount->currency->value)
            ->increment('balance', $amount->value);

        if ($updatedRows === 0) {
            $exception = new ModelNotFoundException();
            $exception->setModel(Account::class, [$accountId]);

            throw $exception;
        }
    }
}
