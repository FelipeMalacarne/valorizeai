<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Enums\Currency;
use App\Models\Budget;
use App\Models\Category;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<\App\Models\Budget>
 */
final class BudgetFactory extends Factory
{
    protected $model = Budget::class;

    public function definition(): array
    {
        $currency = $this->faker->randomElement(Currency::cases());
        $userFactory = User::factory()->state([
            'preferred_currency' => $currency->value,
        ]);

        return [
            'name'        => $this->faker->words(2, true),
            'currency'    => $currency,
            'user_id'     => $userFactory,
            'category_id' => Category::factory()->for($userFactory),
        ];
    }
}
