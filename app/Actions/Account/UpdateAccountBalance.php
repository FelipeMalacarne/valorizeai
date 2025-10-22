<?php

declare(strict_types=1);

namespace App\Actions\Account;

use App\Models\Account;
use App\ValueObjects\Money;

final class UpdateAccountBalance
{
    public function handle(string $accountId, Money $amount): void
    {
        $account = Account::lockForUpdate()->findOrFail($accountId);

        $account->balance = $account->balance->add($amount);

        $account->save();
    }
}
