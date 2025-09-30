<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Enums\Currency;
use App\Models\Category;
use App\Models\Transaction;
use App\ValueObjects\Money;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TransactionSplit>
 */
final class TransactionSplitFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $currency = $this->faker->randomElement(Currency::cases());
        $transaction = Transaction::factory()->create(['currency' => $currency]);

        return [
            'amount'         => new Money($this->faker->numberBetween(100, 10000), $currency),
            'memo'           => $this->faker->sentence(),
            'category_id'    => Category::factory(),
            'transaction_id' => $transaction->id,
        ];
    }
}
