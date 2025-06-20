<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Enums\Color;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
final class CategoryResource extends Data
{
    public function __construct(
        public string $id,
        public string $name,
        public Color $color,
        public ?string $description = null,
        public bool $is_default = false,
    ) {}
}
