<?php

declare(strict_types=1);

namespace App\Http\Requests\Category;

use Spatie\LaravelData\Data;
use Spatie\LaravelData\Support\Validation\ValidationContext;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
final class ListCategoriesRequest extends Data
{
    public function __construct(
        public ?string $search = null,
        public ?bool $is_default = null,
        public int $per_page = 15,
        public int $page = 1,
    ) {}

    public static function rules(ValidationContext $context): array
    {
        return [
            'search'     => ['nullable', 'string', 'max:255'],
            'is_default' => ['nullable', 'boolean'],
            'per_page'   => ['integer', 'min:1', 'max:100'],
            'page'       => ['integer', 'min:1'],
        ];
    }
}
