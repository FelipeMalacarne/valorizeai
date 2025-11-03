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
final class AllocateBudgetRequest extends Data
{
    public function __construct(
        public string $budget_id,
        public string $month,
        #[WithCast(MoneyCast::class)]
        public Money $amount,
    ) {}

    public static function rules(ValidationContext $context): array
    {
        return [
            'budget_id'       => ['required', 'uuid', 'exists:budgets,id'],
            'month'           => ['required', 'date_format:Y-m'],
            'amount'          => ['required', 'array'],
            'amount.value'    => ['required', 'integer'],
            'amount.currency' => ['required', new Enum(Currency::class)],
        ];
    }
}
