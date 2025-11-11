<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Enums\Currency;
use App\Enums\ImportTransactionStatus;
use App\Enums\TransactionType;
use App\Models\Category;
use App\Models\Import;
use App\ValueObjects\Money;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ImportTransaction>
 */
final class ImportTransactionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'import_id'              => Import::factory(),
            'matched_transaction_id' => null,
            'transaction_id'         => null,
            'category_id'            => Category::factory(),
            'status'                 => $this->faker->randomElement(ImportTransactionStatus::cases()),
            'fitid'                  => $this->faker->uuid(),
            'memo'                   => $this->faker->sentence(),
            'currency'               => $this->faker->randomElement(Currency::cases()),
            'type'                   => $this->faker->randomElement(TransactionType::cases()),
            'amount'                 => fn (array $attributes) => new Money(
                $this->faker->numberBetween(-10000, 10000),
                $attributes['currency']
            ),
            'date' => $this->faker->dateTimeThisYear(),
        ];
    }
}
