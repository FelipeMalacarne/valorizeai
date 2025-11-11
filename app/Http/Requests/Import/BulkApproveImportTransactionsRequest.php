<?php

declare(strict_types=1);

namespace App\Http\Requests\Import;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
final class BulkApproveImportTransactionsRequest extends Data
{
    /**
     * @param  string[]  $transaction_ids
     */
    public function __construct(
        public array $transaction_ids,
        public ?string $category_id = null,
    ) {}

    public static function rules(): array
    {
        return [
            'transaction_ids'   => ['required', 'array', 'min:1'],
            'transaction_ids.*' => ['uuid', 'exists:import_transactions,id'],
            'category_id'       => ['nullable', 'uuid', 'exists:categories,id'],
        ];
    }
}
