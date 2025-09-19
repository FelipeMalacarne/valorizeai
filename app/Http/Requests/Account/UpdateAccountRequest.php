<?php

declare(strict_types=1);

namespace App\Http\Requests\Account;

use App\Enums\AccountType;
use App\Enums\Currency;
use Illuminate\Validation\Rules\Enum;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Support\Validation\ValidationContext;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
final class UpdateAccountRequest extends Data
{
    public function __construct(
        public string $name,
        public ?string $number,
        public Currency $currency,
        public AccountType $type,
        public string $bank_id,
    ) {}

    public static function rules(ValidationContext $context): array
    {
        return [
            'name'     => ['required', 'string', 'min:3', 'max:255'],
            'number'   => ['nullable', 'string', 'min:3', 'max:255'],
            'currency' => ['required', new Enum(Currency::class)],
            'type'     => ['required', new Enum(AccountType::class)],
            'bank_id'  => ['required', 'string', 'exists:banks,id'],
        ];
    }
}
