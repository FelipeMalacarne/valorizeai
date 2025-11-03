<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
final class DashboardCategoryShareGroupResource extends Data
{
    /**
     * @param  DashboardCategoryShareResource[]  $items
     */
    public function __construct(
        public string $month,
        public string $label,
        public array $items,
    ) {}
}
