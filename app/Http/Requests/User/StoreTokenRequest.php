<?php

declare(strict_types=1);

namespace App\Http\Requests\User;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
final class StoreTokenRequest extends Data
{
    public function __construct(
        public readonly string $name,
        public readonly ?int $days_to_expire = null,
    ) {}

    public static function rules(): array
    {
        return [
            'name'           => ['required', 'string', 'max:255'],
            'days_to_expire' => ['nullable', 'integer', 'min:1', 'max:365'],
        ];
    }
}
