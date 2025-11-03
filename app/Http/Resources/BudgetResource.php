<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Enums\Currency;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
final class BudgetResource extends Data
{
    public function __construct(
        public string $id,
        public string $name,
        public Currency $currency,
        public CategoryResource $category,
    ) {}
}
