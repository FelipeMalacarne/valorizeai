<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Models\User;
use Illuminate\Validation\Rules;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Support\Validation\ValidationContext;

final class RegisterUserRequest extends Data
{
    public function __construct(
        public string $name,
        public string $email,
        public string $password,
    ) {}

    public static function rules(ValidationContext $context): array
    {
        logger($context->payload);

        return [
            'name'     => ['required', 'string', 'max:255'],
            'email'    => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:'.User::class],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ];
    }
}
