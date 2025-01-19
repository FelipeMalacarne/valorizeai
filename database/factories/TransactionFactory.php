<?php

namespace Database\Factories;

use App\Models\Account;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Transaction>
 */
class TransactionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'amount'      => $this->faker->randomNumber(6),
            'date_posted' => $this->faker->dateTime(),
            'fitid'       => $this->faker->uuid,
            'memo'        => $this->faker->sentence,
            'currency'    => $this->faker->currencyCode,
            'account_id'  => Account::factory(),
        ];
    }

    public function fromUser($user)
    {
        return $this->state(fn (array $attributes) => [
            'account_id' => Account::factory()->create(['user_id' => $user->id])->id,
        ]);
    }
}
