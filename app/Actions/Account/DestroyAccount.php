<?php

declare(strict_types=1);

namespace App\Actions\Account;

use App\Models\Account;
use Illuminate\Support\Facades\DB;

final class DestroyAccount
{
    public function handle(Account $account): bool
    {
        return DB::transaction(function () use ($account) {
            return $account->delete();
        });
    }
}
