<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\ValueObjects\Money;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
final class BudgetMonthlySummaryResource extends Data
{
    public function __construct(
        public bool $has_income,
        public bool $is_inherited,
        public ?string $income_month,
        public ?Money $income,
        public Money $assigned,
        public ?Money $unassigned,
    ) {}
}
