<?php

declare(strict_types=1);

namespace App\Actions\User;

use App\Http\Requests\User\StoreTokenRequest;
use App\Models\User;
use Carbon\Carbon;

final class StoreToken
{
    public function handle(StoreTokenRequest $args, User $user): string
    {
        $expiresAt = $args->days_to_expire
            ? Carbon::now()->addDays($args->days_to_expire)
            : null;

        $token = $user->createToken(
            name: $args->name,
            expiresAt: $expiresAt
        );

        return $token->plainTextToken;
    }
}
