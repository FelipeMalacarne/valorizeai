<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Actions\Transaction\StoreTransaction;
use App\Http\Requests\Transaction\StoreTransactionRequest;
use App\Models\Account;
use App\Models\Category;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Collection;

final class TransactionSeeder extends Seeder
{
    private int $transactionsPerUser;

    public function __construct(
        private readonly StoreTransaction $storeTransaction
    ) {
        $this->transactionsPerUser = (int) env('TRANSACTION_SEED_COUNT', 120);
    }

    public function run(): void
    {
        if (User::query()->count() === 0) {
            User::factory()->create();
        }

        User::query()->each(function (User $user): void {
            $this->seedTransactionsForUser($user);
        });
    }

    private function seedTransactionsForUser(User $user): void
    {
        $accounts = $this->ensureAccounts($user);
        $categories = $this->ensureCategories($user);

        for ($index = 1; $index <= $this->transactionsPerUser; $index++) {
            $account = $accounts->random();
            $categoryId = $categories->isNotEmpty() ? $categories->random()->id : null;
            $date = fake()->dateTimeBetween('-6 months', 'now');

            $this->storeTransaction->handle(
                StoreTransactionRequest::from([
                    'account_id'  => $account->id,
                    'category_id' => $categoryId,
                    'amount'      => [
                        'value'    => $this->randomAmountValue(),
                        'currency' => $account->currency->value,
                    ],
                    'date' => $date->format('Y-m-d'),
                    'memo' => fake()->optional(0.35)->sentence(3),
                ])
            );

            if ($index % 5000 === 0) {
                $this->command?->getOutput()->writeln(
                    sprintf('Seeded %d/%d transactions for user %s', $index, $this->transactionsPerUser, $user->email)
                );
            }
        }
    }

    /**
     * @return Collection<int, Account>
     */
    private function ensureAccounts(User $user): Collection
    {
        $accounts = $user->accounts()->get();

        if ($accounts->isNotEmpty()) {
            return $accounts;
        }

        return Account::factory()
            ->count(2)
            ->create([
                'user_id'  => $user->id,
                'currency' => $user->preferred_currency,
            ]);
    }

    /**
     * @return Collection<int, Category>
     */
    private function ensureCategories(User $user): Collection
    {
        $categories = $user->categories()->get();

        if ($categories->isNotEmpty()) {
            return $categories;
        }

        return Category::factory()
            ->count(6)
            ->create([
                'user_id' => $user->id,
            ]);
    }

    private function randomAmountValue(): int
    {
        $value = fake()->numberBetween(500, 250_000); // 5 to 2,500 in cents

        return fake()->boolean(45) ? -$value : $value;
    }
}
