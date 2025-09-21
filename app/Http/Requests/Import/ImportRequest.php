<?php

declare(strict_types=1);

namespace App\Http\Requests\Import;

use Spatie\LaravelData\Data;
use Spatie\LaravelData\Support\Validation\ValidationContext;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
final class ImportRequest extends Data
{
    /**
     * @param  UploadFile[]  $files
     */
    public function __construct(
        public array $files,
        public string $account_id,
    ) {}

    public static function rules(ValidationContext $context): array
    {
        return [
            'files'      => ['required', 'array'],
            'files.*'    => ['required', 'file', 'mimetypes:text/csv,application/ofx'],
            'account_id' => ['required', 'uuid', 'exists:accounts,id'],
        ];
    }
}
