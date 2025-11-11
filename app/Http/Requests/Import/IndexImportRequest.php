<?php

declare(strict_types=1);

namespace App\Http\Requests\Import;

use App\Enums\ImportStatus;
use Illuminate\Validation\Rules\Enum;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
final class IndexImportRequest extends Data
{
    public function __construct(
        public ?string $search = null,
        public ?ImportStatus $status = null,
        public int $page = 1,
        public int $per_page = 10,
    ) {}

    public static function rules(): array
    {
        return [
            'search'   => ['nullable', 'string', 'max:255'],
            'status'   => ['nullable', new Enum(ImportStatus::class)],
            'page'     => ['integer', 'min:1'],
            'per_page' => ['integer', 'min:1', 'max:100'],
        ];
    }
}
