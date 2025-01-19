<?php

namespace Database\Factories;

use App\Enums\Color;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use SupportsProjections;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Account>
 */
class AccountFactory extends Factory
{
    use SupportsProjections;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name'        => $this->faker->name,
            'balance'     => $this->faker->randomNumber(7),
            'type'        => $this->faker->randomElement(['checking', 'savings']),
            'number'      => $this->faker->creditCardNumber,
            'color'       => $this->faker->randomElement(Color::cases()),
            'description' => $this->faker->sentence,
            'user_id'     => User::factory(),
        ];
    }
}
