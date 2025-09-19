<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Enums\Currency;
use App\Enums\ImportTransactionStatus;
use App\Models\Category;
use App\Models\Import;
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
            'import_id' => Import::factory(),
            'matched_transaction_id' => null,
            'category_id' => Category::factory(),
            'status' => $this->faker->randomElement(ImportTransactionStatus::cases()),
            'fitid' => $this->faker->uuid(),
            'memo' => $this->faker->sentence(),
            'currency' => $this->faker->randomElement(Currency::cases()),
            'amount' => $this->faker->numberBetween(100, 100000),
            'date' => $this->faker->dateTimeThisYear(),
        ];
    }
}
