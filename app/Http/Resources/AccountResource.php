<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Enums\AccountType;
use App\Enums\Currency;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
final class AccountResource extends Data
{
    public function __construct(
        public string $id,
        public string $name,
        public ?string $number,
        public Currency $currency,
        public AccountType $type,
        public BankResource $bank
    ) {}
}
