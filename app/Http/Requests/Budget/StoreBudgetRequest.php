<?php

declare(strict_types=1);

namespace App\Http\Requests\Budget;

use Spatie\LaravelData\Data;
use Spatie\LaravelData\Support\Validation\ValidationContext;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
final class StoreBudgetRequest extends Data
{
    public function __construct(
        public string $category_id,
        public ?string $name = null,
    ) {}

    public static function rules(ValidationContext $context): array
    {
        return [
            'category_id' => ['required', 'uuid', 'exists:categories,id'],
            'name'        => ['nullable', 'string', 'max:255'],
        ];
    }
}
