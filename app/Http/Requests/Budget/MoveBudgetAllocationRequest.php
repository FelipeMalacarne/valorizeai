<?php

declare(strict_types=1);

namespace App\Http\Requests\Budget;

use App\Casts\MoneyCast;
use App\Enums\Currency;
use App\ValueObjects\Money;
use Illuminate\Validation\Rules\Enum;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Support\Validation\ValidationContext;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
final class MoveBudgetAllocationRequest extends Data
{
    public function __construct(
        public string $from_budget_id,
        public string $to_budget_id,
        public string $month,
        #[WithCast(MoneyCast::class)]
        public Money $amount,
    ) {}

    public static function rules(ValidationContext $context): array
    {
        return [
            'from_budget_id'  => ['required', 'uuid', 'exists:budgets,id', 'different:to_budget_id'],
            'to_budget_id'    => ['required', 'uuid', 'exists:budgets,id', 'different:from_budget_id'],
            'month'           => ['required', 'date_format:Y-m'],
            'amount'          => ['required', 'array'],
            'amount.value'    => ['required', 'integer', 'min:0'],
            'amount.currency' => ['required', new Enum(Currency::class)],
        ];
    }
}
