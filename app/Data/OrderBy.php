<?php

declare(strict_types=1);

namespace App\Data;

use App\Enums\OrderByDirection;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
final class OrderBy extends Data
{
    public function __construct(
        public string $column,
        public OrderByDirection $direction = OrderByDirection::DESC,
    ) {}

    public static function asc(string $column): self
    {
        return new self($column, OrderByDirection::ASC);
    }

    public static function desc(string $column): self
    {
        return new self($column, OrderByDirection::DESC);
    }
}
