<?php

declare(strict_types=1);

namespace App\ValueObjects;

use App\Enums\Currency; // Make sure to import your Currency enum
use Illuminate\Contracts\Database\Eloquent\Castable;
use Illuminate\Contracts\Database\Eloquent\CastsAttributes;
use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Number;
use InvalidArgumentException;
use JsonSerializable;
use Spatie\LaravelData\Casts\Cast;
use Spatie\LaravelData\Casts\Castable as DataCastable;
use Spatie\LaravelData\Support\Creation\CreationContext;
use Spatie\LaravelData\Support\DataProperty;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;
use Stringable;

#[TypeScript]
final class Money implements Arrayable, Castable, DataCastable, JsonSerializable, Stringable // , DataCastable
{
    public function __construct(
        public readonly int $amount, // Stored in the smallest unit (e.g., cents)
        public readonly Currency $currency
    ) {}

    public function __toString(): string
    {
        return $this->format();
    }

    public static function try(?int $amount, ?Currency $currency): ?self
    {
        if ($amount === null || $currency === null) {
            return null;
        }
        try {
            return new self($amount, $currency);
        } catch (InvalidArgumentException $e) {
            return null;
        }
    }

    public static function castUsing(array $arguments): CastsAttributes
    {
        return new class implements CastsAttributes
        {
            public function get(Model $model, string $key, mixed $value, array $attributes): ?Money
            {
                $amount = $attributes['amount'] ?? null;
                $currencyValue = $attributes['currency'] ?? null;

                if ($amount === null || $currencyValue === null) {
                    return null;
                }

                if (! ($currency = Currency::tryFrom($currencyValue))) {
                    report(new InvalidArgumentException("Invalid currency value '{$currencyValue}' for account {$model->id}"));

                    return null;
                }

                return new Money((int) $amount, $currency);
            }

            public function set(Model $model, string $key, mixed $value, array $attributes): array
            {
                // Allow setting null to clear balance and currency
                if ($value === null) {
                    return [
                        'amount'  => null,
                        'currency' => null,
                    ];
                }

                // Allow setting from an integer amount and string currency
                if (is_array($value) && isset($value['amount'], $value['currency'])) {
                    $currency = Currency::tryFrom($value['currency']);
                    if ($currency === null) {
                        throw new InvalidArgumentException("Invalid currency value '{$value['currency']}' provided for setting Money.");
                    }
                    $value = new Money((int) $value['amount'], $currency);
                }
                // Allow setting from an integer amount and enum currency
                if (is_array($value) && isset($value['amount'], $value['currency']) && $value['currency'] instanceof Currency) {
                    $value = new Money((int) $value['amount'], $value['currency']);
                }

                if (! $value instanceof Money) {
                    throw new InvalidArgumentException('The value must be an instance of App\ValueObjects\Money or a valid array.');
                }

                return [
                    'amount'  => $value->amount, // Integer (smallest unit)
                    'currency' => $value->currency->value, // Enum value (string)
                ];
            }
        };
    }

    // If using Spatie Laravel Data, uncomment and implement dataCastUsing
    public static function dataCastUsing(array $arguments): Cast
    {
        return new class implements Cast
        {
            public function cast(DataProperty $property, mixed $value, array $properties, CreationContext $context): mixed
            {
                // This logic depends on how your data is structured when casting to a Data Object.
                // Assuming the input data has 'amount' and 'currency' keys:
                if (is_array($value) && isset($value['amount'], $value['currency'])) {
                    $currency = Currency::tryFrom($value['currency']);
                    if ($currency) {
                        return new Money((int) $value['amount'], $currency);
                    }
                }

                // Handle other potential input formats or return null/throw error
                return null; // Or throw new Exception("Could not cast data to Money object");
            }
        };
    }

    public function format(): string
    {
        return Number::currency(round($this->amount / 100, 2), $this->currency->value);
    }

    public function equals(self $other): bool
    {
        return $this->amount === $other->amount && $this->currency === $other->currency;
    }

    public function add(self $other): self
    {
        if ($this->currency !== $other->currency) {
            // Handle currency conversion or throw an exception
            throw new InvalidArgumentException('Cannot add money of different currencies.');
        }

        // Returns a NEW instance because value objects are immutable
        return new self($this->amount + $other->amount, $this->currency);
    }

    public function subtract(self $other): self
    {
        if ($this->currency !== $other->currency) {
            // Handle currency conversion or throw an exception
            throw new InvalidArgumentException('Cannot subtract money of different currencies.');
        }

        // Returns a NEW instance
        return new self($this->amount - $other->amount, $this->currency);
    }

    /**
     * Get an array representation of the money object.
     * Implements Arrayable interface.
     *
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'amount'          => $this->amount, // Integer (smallest unit)
            'formatted'       => $this->format(), // Formatted string (e.g., "$10.50")
            'currency'        => $this->currency->value, // String value of the enum
        ];
    }

    /**
     * Specify data which should be serialized to JSON.
     * Implements JsonSerializable interface.
     */
    public function jsonSerialize(): mixed
    {
        // You can choose what gets JSON encoded.
        // Returning the formatted string is common for simple cases.
        // Returning the array representation is also common for more detail.
        return $this->toArray(); // Example: return the array representation
        // return $this->format(); // Example: return just the formatted string
    }
}
