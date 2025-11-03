<?php

declare(strict_types=1);

namespace App\Actions;

use App\Actions\Category\EnsureDefaultCategoriesForUser;
use App\Http\Requests\RegisterUserRequest;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

final class RegisterUser
{
    public function __construct(private readonly EnsureDefaultCategoriesForUser $ensureDefaultCategories) {}

    public function handle(RegisterUserRequest $data): User
    {
        $user = DB::transaction(function () use ($data) {
            $user = User::create([
                'name'               => $data->name,
                'email'              => $data->email,
                'password'           => Hash::make($data->password),
                'preferred_currency' => $data->preferred_currency,
            ]);

            return $user;
        });

        $this->ensureDefaultCategories->handle($user);

        event(new Registered($user));

        return $user;
    }
}
