<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\ValueObjects\Money;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
final class DashboardCategoryShareResource extends Data
{
    public function __construct(
        public CategoryResource $category,
        public Money $total,
        public float $percentage,
    ) {}
}
