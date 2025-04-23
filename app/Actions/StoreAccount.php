<?php

declare(strict_types=1);

namespace App\Actions;

use App\Http\Requests\StoreAccountRequest;
use App\Models\Account;

final class StoreAccount
{
    public function handle(StoreAccountRequest $data): Account
    {
        return $data->oganization->accounts()->create([
            'name'        => $data->name,
            'bank_code'   => $data->bank_code,
            'currency'    => $data->currency,
            'color'       => $data->color,
            'type'        => $data->type,
            'description' => $data->description,
        ]);
    }
}
