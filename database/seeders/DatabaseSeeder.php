<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\User;
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
            \App\Models\Transaction::factory(10)->create([
                'account_id' => $account->id,
            ]);
        }

        $this->call([
            BankSeeder::class,
            CategorySeeder::class,
        ]);
    }
}
