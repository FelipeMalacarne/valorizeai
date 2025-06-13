<?php

declare(strict_types=1);

namespace App\Actions\Account;

use App\Models\Account;

final class DestroyAccount
{
    public function handle(Account $account): bool
    {
        return $account->delete();
    }
}
