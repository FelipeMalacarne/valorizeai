<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Enums\TransactionType;
use App\Models\Account;
use App\Models\Category;
use App\ValueObjects\Money;
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
            'fitid'       => $this->faker->uuid(),
            'memo'        => $this->faker->sentence(),
            'type'        => $this->faker->randomElement(TransactionType::cases()),
            'date'        => $this->faker->dateTimeBetween('-1 year', 'now'),
            'category_id' => Category::factory(),
            'account_id'  => Account::factory(),
            'currency'    => fn (array $attributes) => Account::find($attributes['account_id'])->currency,
            'amount'      => fn (array $attributes) => new Money(
                $this->faker->numberBetween(-10000, 10000),
                $attributes['currency']
            ),
        ];
    }
}
