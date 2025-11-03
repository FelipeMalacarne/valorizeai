<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\ValueObjects\Money;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
final class CategoryInsightsResource extends Data
{
    /**
     * @param  CategoryMonthlyTotalResource[]  $monthly
     * @param  CategoryAccountBreakdownResource[]  $accounts
     */
    public function __construct(
        public Money $total_debits,
        public Money $total_credits,
        public Money $net_total,
        public array $monthly,
        public array $accounts,
    ) {}
}
