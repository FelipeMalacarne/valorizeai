<?php

declare(strict_types=1);

namespace App\Actions\Account;

use App\Http\Requests\Account\UpdateAccountRequest;
use App\Models\Account;

final class UpdateAccount
{
    public function handle(UpdateAccountRequest $data, Account $account): Account
    {
        if ($data->name) {
            $account->name = $data->name;
        }

        if ($data->number) {
            $account->number = $data->number;
        }

        if ($data->type) {
            $account->type = $data->type;
        }

        $account->save();

        return $account;
    }
}
