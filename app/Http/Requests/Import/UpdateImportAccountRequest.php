<?php

declare(strict_types=1);

namespace App\Http\Requests\Import;

use Illuminate\Validation\Rule;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
final class UpdateImportAccountRequest extends Data
{
    public function __construct(
        public string $account_id,
    ) {}

    public static function rules(): array
    {
        return [
            'account_id' => [
                'required',
                'uuid',
                Rule::exists('accounts', 'id')->where(fn ($query) => $query->where('user_id', auth()->id())),
            ],
        ];
    }
}
