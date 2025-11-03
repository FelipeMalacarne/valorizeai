<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Budget;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<\App\Models\BudgetAllocation>
 */
final class BudgetAllocationFactory extends Factory
{
    public function definition(): array
    {
        $month = CarbonImmutable::instance($this->faker->dateTimeThisYear())->startOfMonth();

        return [
            'budget_id'       => Budget::factory(),
            'month'           => $month,
            'budgeted_amount' => $this->faker->numberBetween(10_00, 1_000_00),
        ];
    }
}
