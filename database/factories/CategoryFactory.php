<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Concerns\SupportsProjections;
use App\Domain\Account\Enums\Color;
use App\Domain\Category\Projections\Category;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<Category>
 */
final class CategoryFactory extends Factory
{
    use SupportsProjections;

    protected $model = Category::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name'        => $this->faker->word(),
            'color'       => $this->faker->randomElement(Color::cases()),
            'is_default'  => false,
            'user_id'     => User::factory(),
        ];
    }

    public function isDefault(bool $default = true): static
    {
        return $this->state(fn () => [
            'is_default' => $default,
            'user_id'    => $default ? null : User::factory(),
        ]);
    }
}
