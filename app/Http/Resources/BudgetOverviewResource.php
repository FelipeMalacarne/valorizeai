<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Enums\Currency;
use App\ValueObjects\Money;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
final class BudgetOverviewResource extends Data
{
    public function __construct(
        public string $id,
        public Currency $currency,
        public CategoryResource $category,
        public Money $budgeted_amount,
        public Money $spent_amount,
        public Money $rollover_amount,
        public Money $remaining_amount,
    ) {}
}
