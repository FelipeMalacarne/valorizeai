<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Concerns\SupportsProjections;
use App\Domain\Account\Enums\Color;
use App\Domain\Account\Projections\Account;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Domain\Account\Projections\Account>
 */
final class AccountFactory extends Factory
{
    use SupportsProjections;

    protected $model = Account::class;

    public function definition(): array
    {
        return [
            'name'        => $this->faker->name,
            'balance'     => $this->faker->randomNumber(7),
            'type'        => $this->faker->randomElement(['checking', 'savings']),
            'number'      => $this->faker->creditCardNumber,
            'color'       => $this->faker->randomElement(Color::cases()),
            'description' => $this->faker->sentence,
            'bank_code'   => (string) $this->faker->randomNumber(3),
            'user_id'     => User::factory(),
        ];
    }
}
