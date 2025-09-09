<?php

declare(strict_types=1);

namespace App\ValueObjects;

use App\Enums\Currency;
use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Support\Number;
use InvalidArgumentException;
use JsonSerializable;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;
use Stringable;

#[TypeScript]
final class Money implements Arrayable, JsonSerializable, Stringable
{
    public string $formatted;

    public function __construct(
        public readonly int $value, // Stored in the smallest unit (e.g., cents)
        public readonly Currency $currency
    ) {}

    public function __toString(): string
    {
        return $this->format();
    }

    public static function from(int|float $amount, Currency $currency): self
    {
        if (! is_int($amount) && ! is_float($amount)) {
            throw new InvalidArgumentException('Amount must be an integer or float.');
        }

        $value = (int) round($amount * 100);

        return new self($value, $currency);
    }

    public static function try(int|float $amount, Currency $currency): ?self
    {
        try {
            return self::from($amount, $currency);
        } catch (InvalidArgumentException $e) {
            return null;
        }
    }

    public function format(): string
    {
        return Number::currency(round($this->value / 100, 2), $this->currency->value);
    }

    public function equals(self $other): bool
    {
        return $this->value === $other->value && $this->currency === $other->currency;
    }

    public function add(self $other): self
    {
        if ($this->currency !== $other->currency) {
            // Handle currency conversion or throw an exception
            throw new InvalidArgumentException('Cannot add money of different currencies.');
        }

        // Returns a NEW instance because value objects are immutable
        return new self($this->value + $other->value, $this->currency);
    }

    public function subtract(self $other): self
    {
        if ($this->currency !== $other->currency) {
            // Handle currency conversion or throw an exception
            throw new InvalidArgumentException('Cannot subtract money of different currencies.');
        }

        // Returns a NEW instance
        return new self($this->value - $other->value, $this->currency);
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
            'value'     => $this->value, // Integer (smallest unit)
            'formatted' => $this->format(), // Formatted string (e.g., "$10.50")
            'currency'  => $this->currency->value, // String value of the enum
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
