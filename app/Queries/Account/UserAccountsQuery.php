<?php

declare(strict_types=1);

namespace App\Queries\Account;

use App\Http\Resources\AccountResource;
use App\Models\Account;
use Illuminate\Support\Collection;

final class UserAccountsQuery
{
    public function handle(string $userId)
    {
        return Account::where('user_id', $userId)
            ->with('bank')
            ->get();
    }

    /** @return Collection<int, AccountResource> */
    public function resource(string $userId)
    {
        return AccountResource::collect($this->handle($userId));
    }
}
