<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Enums\Color;
use App\Models\Category;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use RuntimeException;

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
            'color'       => null,
            'is_default'  => false,
            'user_id'     => User::factory(),
        ];
    }

    public function configure(): self
    {
        return $this->afterMaking(function (Category $category) {
            if ($category->color !== null) {
                return;
            }

            $category->color = $this->nextAvailableColor($category->user_id);
        });
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

    private function nextAvailableColor(?string $userId): Color
    {
        $availableColors = $this->availableColors($userId);

        if ($availableColors === []) {
            throw new RuntimeException('Todos os tons cadastrados já foram utilizados por este usuário.');
        }

        return $this->faker->randomElement($availableColors);
    }

    /**
     * @return array<int, Color>
     */
    private function availableColors(?string $userId): array
    {
        if ($userId === null) {
            return Color::cases();
        }

        $usedColors = Category::query()
            ->where('user_id', $userId)
            ->pluck('color')
            ->all();

        return array_values(array_filter(
            Color::cases(),
            static fn (Color $color): bool => ! in_array($color->value, $usedColors, true)
        ));
    }
}
