<?php

declare(strict_types=1);

namespace App\Actions\Account;

use App\Http\Requests\Account\UpdateAccountRequest;
use App\Models\Account;
use Illuminate\Support\Facades\DB;

final class UpdateAccount
{
    public function handle(UpdateAccountRequest $data, Account $account): Account
    {
        return DB::transaction(function () use ($data, $account) {
            $account->name = $data->name;
            $account->number = $data->number;
            $account->currency = $data->currency;
            $account->type = $data->type;
            $account->bank_id = $data->bank_id;

            $account->save();

            return $account;
        });
    }
}
