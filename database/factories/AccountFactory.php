<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Enums\AccountType;
use App\Enums\Currency;
use App\Models\Bank;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Account>
 */
final class AccountFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name'     => $this->faker->word,
            'balance'  => $this->faker->randomNumber(7),
            'number'   => $this->faker->numerify('########-#'),
            'type'     => $this->faker->randomElement(AccountType::cases()),
            'currency' => $this->faker->randomElement(Currency::cases()),
            'bank_id'  => Bank::factory(),
            'user_id'  => User::factory(),
        ];
    }
}
