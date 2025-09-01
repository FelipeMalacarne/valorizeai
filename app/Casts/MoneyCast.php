<?php

declare(strict_types=1);

namespace App\Casts;

use App\Enums\Currency;
use App\ValueObjects\Money;
use Illuminate\Contracts\Database\Eloquent\CastsAttributes;
use Illuminate\Database\Eloquent\Model;
use InvalidArgumentException;
use Spatie\LaravelData\Casts\Cast;
use Spatie\LaravelData\Support\Creation\CreationContext;
use Spatie\LaravelData\Support\DataProperty;

final class MoneyCast implements CastsAttributes, Cast
{
    /**
     * Cast the stored value to a Money object for Eloquent Models.
     */
    public function get(Model $model, string $key, mixed $value, array $attributes): ?Money
    {
        if ($value === null) {
            return null;
        }

        $currency = $attributes['currency'] ?? null;

        if (! $currency instanceof Currency) {
            $currency = Currency::tryFrom((string) $currency);
        }

        if ($currency === null) {
            throw new InvalidArgumentException('Currency is required to cast to Money object.');
        }

        return new Money((int) $value, $currency);
    }

    /**
     * Prepare the Money object for storage for Eloquent Models.
     */
    public function set(Model $model, string $key, mixed $value, array $attributes): ?int
    {
        if ($value === null) {
            return null;
        }

        if ($value instanceof Money) {
            return $value->value;
        }

        if (is_int($value)) {
            return $value;
        }

        throw new InvalidArgumentException('The given value is not a Money instance or an integer.');
    }

    /**
     * Cast the given value for Spatie Data Objects.
     */
    public function cast(DataProperty $property, mixed $value, array $properties, CreationContext $context): Money
    {
        $currency = Currency::tryFrom($value['currency']);

        return new Money((int) $value['amount'], $currency);
    }
}