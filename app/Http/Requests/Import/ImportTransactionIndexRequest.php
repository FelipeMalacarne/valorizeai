<?php

declare(strict_types=1);

namespace App\Http\Requests\Import;

use App\Enums\ImportTransactionStatus;
use App\Enums\TransactionType;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;
use Illuminate\Validation\Rules\Enum;

#[TypeScript]
final class ImportTransactionIndexRequest extends Data
{
    public function __construct(
        public ?string $search = null,
        public ?ImportTransactionStatus $status = null,
        public ?TransactionType $type = null,
        public int $page = 1,
        public int $per_page = 15,
    ) {}

    public static function rules(): array
    {
        return [
            'search'   => ['nullable', 'string', 'max:255'],
            'status'   => ['nullable', new Enum(ImportTransactionStatus::class)],
            'type'     => ['nullable', new Enum(TransactionType::class)],
            'page'     => ['integer', 'min:1'],
            'per_page' => ['integer', 'min:1', 'max:100'],
        ];
    }
}
