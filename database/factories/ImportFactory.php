<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Enums\ImportExtension;
use App\Enums\ImportStatus;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Import>
 */
final class ImportFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id'          => User::factory(),
            'file_name'        => $this->faker->word.'.ofx',
            'extension'        => $this->faker->randomElement(ImportExtension::cases()),
            'status'           => $this->faker->randomElement(ImportStatus::cases()),
            'new_count'        => $this->faker->numberBetween(0, 100),
            'matched_count'    => $this->faker->numberBetween(0, 50),
            'conflicted_count' => $this->faker->numberBetween(0, 10),
        ];
    }
}
