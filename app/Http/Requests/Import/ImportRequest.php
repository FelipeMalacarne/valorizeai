<?php

declare(strict_types=1);

namespace App\Http\Requests\Import;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Collection;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Support\Validation\ValidationContext;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
final class ImportRequest extends Data
{
    public function __construct(
        /** @var Collection<int, UploadedFile> */
        public Collection $files,
        public string $account_id,
    ) {}

    public static function rules(ValidationContext $context): array
    {
        return [
            'files'      => ['required', 'array'],
            'files.*'    => ['required', 'file', 'mimes:ofx,csv'],
            'account_id' => ['required', 'uuid', 'exists:accounts,id'],
        ];
    }
}
