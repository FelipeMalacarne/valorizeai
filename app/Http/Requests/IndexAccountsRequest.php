<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Enums\AccountType;
use App\Enums\Currency;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
final class IndexAccountsRequest extends Data
{
    public function __construct(
        public ?string $search,
        public ?AccountType $type,
        public ?Currency $currency,
    ) {}
}
