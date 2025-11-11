<?php

declare(strict_types=1);

namespace App\Http\Requests\Import;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
final class ApproveImportTransactionRequest extends Data
{
    public function __construct(
        public ?string $category_id = null,
        public bool $replace_existing = false,
    ) {}

    public static function rules(): array
    {
        return [
            'category_id'      => ['nullable', 'uuid', 'exists:categories,id'],
            'replace_existing' => ['boolean'],
        ];
    }
}
