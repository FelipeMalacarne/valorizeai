<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Enums\Color;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Category>
 */
final class CategoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name'        => $this->faker->word(),
            'description' => $this->faker->sentence(),
            'color'       => $this->faker->randomElement(Color::cases()),
            'is_default'  => false,
            'user_id'     => User::factory(),
        ];
    }

    public function default(): self
    {
        return $this->state(function (array $attributes) {
            return [
                'is_default' => true,
                'user_id'    => null,
            ];
        });
    }
}
