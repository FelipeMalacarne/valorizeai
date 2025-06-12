<?php

declare(strict_types=1);

namespace App\Actions\Account;

use App\Http\Requests\StoreAccountRequest;
use App\Models\Account;
use App\Models\User;

final class StoreAccount
{
    public function handle(StoreAccountRequest $data, User $user): Account
    {
        return $user->accounts()->create([
            'name'     => $data->name,
            'number'   => $data->number,
            'currency' => $data->currency,
            'type'     => $data->type,
            'bank_id'  => $data->bank_id,
        ]);
    }
}
