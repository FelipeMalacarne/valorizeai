<?php

declare(strict_types=1);

namespace App\Http\Requests\Category;

use App\Enums\Color;
use App\Models\Category;
use Illuminate\Support\Facades\Auth;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Support\Validation\ValidationContext;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
final class UpdateCategoryRequest extends Data
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
            'name' => [
                'required',
                'string',
                'max:255',
                function ($attribute, $value, $fail) {
                    $userId = Auth::id();
                    $categoryId = request()->route('category');

                    if ($userId && $categoryId) {
                        $exists = Category::where('name', $value)
                            ->where('user_id', $userId)
                            ->where('id', '!=', $categoryId)
                            ->exists();

                        if ($exists) {
                            $fail('A category with this name already exists.');
                        }
                    }
                },
            ],
            'description' => ['nullable', 'string', 'max:500'],
            'color' => ['required'],
            'is_default' => ['boolean'],
        ];
    }
}
