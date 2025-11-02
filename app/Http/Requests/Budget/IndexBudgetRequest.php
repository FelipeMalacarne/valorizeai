<?php

declare(strict_types=1);

namespace App\Http\Requests\Budget;

use Spatie\LaravelData\Data;
use Spatie\LaravelData\Support\Validation\ValidationContext;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
final class IndexBudgetRequest extends Data
{
    public function __construct(
        public ?string $month = null,
    ) {}

    public static function rules(ValidationContext $context): array
    {
        return [
            'month' => ['nullable', 'date_format:Y-m'],
        ];
    }
}
