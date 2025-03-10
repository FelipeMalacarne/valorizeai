<?php

declare(strict_types=1);

namespace App\Support\Data;

use App\Support\Enums\OrderByDirection;
use Spatie\LaravelData\Data;

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
