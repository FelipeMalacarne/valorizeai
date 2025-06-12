<?php

declare(strict_types=1);

namespace App\Http\Requests\Account;

use App\Enums\AccountType;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
final class UpdateAccountRequest extends Data
{
    public function __construct(
        public ?string $name = null,
        public ?string $number = null,
        public ?AccountType $type = null,
    ) {}
}
