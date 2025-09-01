<?php

declare(strict_types=1);

namespace App\Casts;

use App\Enums\Currency;
use App\ValueObjects\Money;
use Illuminate\Contracts\Database\Eloquent\CastsAttributes;
use Illuminate\Database\Eloquent\Model;
use InvalidArgumentException;

final class MoneyCast implements CastsAttributes
{
    /**
     * Cast the stored value to a Money object.
     */
    public function get(Model $model, string $key, mixed $value, array $attributes): ?Money
    {
        if ($value === null) {
            return null;
        }

        // Assuming the model has a 'currency' attribute
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
     * Prepare the Money object for storage.
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
}
