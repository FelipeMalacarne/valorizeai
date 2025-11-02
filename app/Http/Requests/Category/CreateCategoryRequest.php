<?php

declare(strict_types=1);

namespace App\Http\Requests\Category;

use App\Enums\Color;
use App\Models\Category;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Support\Validation\ValidationContext;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
final class CreateCategoryRequest extends Data
{
    public function __construct(
        public string $name,
        public Color $color,
        public ?string $description = null,
        public bool $is_default = false,
    ) {}

    public static function rules(ValidationContext $context): array
    {
        return [
            'name'        => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:500'],
            'color'       => [
                'required',
                Rule::enum(Color::class),
                function ($attribute, $value, $fail) {
                    $userId = Auth::id();

                    if (! $userId) {
                        return;
                    }

                    $exists = Category::query()
                        ->where('user_id', $userId)
                        ->where('color', $value instanceof Color ? $value->value : (string) $value)
                        ->exists();

                    if ($exists) {
                        $fail('Você já possui uma categoria com esta cor.');
                    }
                },
            ],
            'is_default'  => ['boolean'],
        ];
    }
}
