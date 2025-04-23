<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Enums\AccountType;
use App\Enums\Color;
use App\Enums\Currency;
use App\Models\Organization;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Account>
 */
final class AccountFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name'            => $this->faker->word,
            'balance'         => $this->faker->randomNumber(7),
            'number'          => $this->faker->numerify('########'),
            'type'            => $this->faker->randomElement(AccountType::cases()),
            'color'           => $this->faker->randomElement(Color::cases()),
            'currency'        => $this->faker->randomElement(Currency::cases()),
            'description'     => $this->faker->sentence,
            'bank_code'       => (string) $this->faker->randomNumber(3),
            'organization_id' => Organization::factory(),
        ];
    }
}
