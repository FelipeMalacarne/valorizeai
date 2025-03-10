<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Concerns\SupportsProjections;
use App\Domain\Account\Projections\Account;
use App\Domain\Category\Projections\Category;
use App\Domain\Transaction\Projections\Transaction;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Domain\Transaction\Projections\Transaction>
 */
final class TransactionFactory extends Factory
{
    use SupportsProjections;

    protected $model = Transaction::class;

    public function definition(): array
    {
        return [
            'amount'      => $this->faker->randomNumber(6),
            'date_posted' => $this->faker->dateTime(),
            'fitid'       => $this->faker->uuid,
            'memo'        => $this->faker->sentence,
            'currency'    => $this->faker->currencyCode,
            'account_id'  => Account::factory(),
        ];
    }

    public function configure(): static
    {
        return $this->afterCreating(function (Transaction $transaction) {
            $transaction->categories()
                ->attach(Category::inRandomOrder()
                    ->limit($this->faker->numberBetween(1, 4))
                    ->get()
                );
        });
    }

    public function fromUser(User $user): static
    {
        return $this->state(fn (array $attributes) => [
            'account_id' => Account::factory()->create(['user_id' => $user->id])->id,
        ]);
    }
}
