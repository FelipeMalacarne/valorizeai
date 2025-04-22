<?php

declare(strict_types=1);

namespace App\Actions;

use App\Enums\Currency;
use App\Enums\OrganizationRole;
use App\Http\Requests\RegisterUserRequest;
use App\Models\Organization;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

final class RegisterUser
{
    public function handle(RegisterUserRequest $data): User
    {
        return DB::transaction(function () use ($data) {
            $user = User::create([
                'name'     => $data->name,
                'email'    => $data->email,
                'password' => Hash::make($data->password),
            ]);

            $organization = Organization::create([
                'name'               => $data->name,
                'preferred_currency' => Currency::BRL,
            ]);

            $organization->users()->attach($user->id, [
                'role' => OrganizationRole::OWNER,
            ]);

            $user->update(['current_organization_id' => $organization->id]);

            event(new Registered($user));

            return $user;
        });
    }
}
