<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\User;
use App\Models\TransactionSplit; // Added this line
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

final class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        $user = User::factory()->create([
            'name'               => 'Test User',
            'email'              => 'test@example.com',
            'preferred_currency' => 'BRL',
        ]);

        // Create accounts for the user
        $accounts = \App\Models\Account::factory(3)->create([
            'user_id' => $user->id,
        ]);

        // Create transactions for each account
        foreach ($accounts as $account) {
            // Create some transactions
            \App\Models\Transaction::factory(5)->create([
                'account_id' => $account->id,
            ])->each(function (\App\Models\Transaction $transaction) {
                // Create splits for some transactions
                if (rand(0, 1)) { // Randomly create splits for half of the transactions
                    \App\Models\TransactionSplit::factory(rand(2, 3))->create([
                        'transaction_id' => $transaction->id,
                    ]);
                }
            });

            // Create some transactions without splits
            \App\Models\Transaction::factory(3)->create([
                'account_id' => $account->id,
            ]);
        }

        $this->call([
            BankSeeder::class,
            CategorySeeder::class,
        ]);
    }
}
