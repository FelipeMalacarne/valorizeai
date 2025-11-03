<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\ValueObjects\Money;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
final class DashboardSummaryResource extends Data
{
    public function __construct(
        public Money $total_balance,
        public Money $monthly_income,
        public Money $monthly_expense,
        public Money $monthly_profit,
    ) {}
}
