<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\ValueObjects\Money;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
final class CategoryMonthlyTotalResource extends Data
{
    public function __construct(
        public string $month,
        public Money $debits,
        public Money $credits,
    ) {}
}
