<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Enums\Currency;
use App\Enums\TransactionType;
use App\Models\Account;
use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Transaction>
 */
final class TransactionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'amount'      => $this->faker->numberBetween(-10000, 10000),
            'fitid'       => $this->faker->uuid(),
            'memo'        => $this->faker->sentence(),
            'currency'    => $this->faker->randomElement(Currency::cases()),
            'type'        => $this->faker->randomElement(TransactionType::cases()),
            'date'        => $this->faker->dateTimeBetween('-1 year', 'now'),
            'category_id' => Category::factory()->create(),
            'account_id'  => Account::factory()->create(),
        ];
    }
}
