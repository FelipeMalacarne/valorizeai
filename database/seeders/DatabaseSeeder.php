<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Account;
use App\Models\Category;
use App\Models\User;
use Illuminate\Database\Seeder;

final class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $user = User::factory()->create([
            'name'               => 'Test User',
            'email'              => 'test@example.com',
            'preferred_currency' => 'BRL',
        ]);

        Account::factory()
            ->count(3)
            ->create([
                'user_id'  => $user->id,
                'currency' => $user->preferred_currency,
            ]);

        // Category::factory()
        //     ->count(8)
        //     ->create([
        //         'user_id' => $user->id,
        //     ]);

        $this->call([
            BankSeeder::class,
            CategorySeeder::class,
            TransactionSeeder::class,
        ]);
    }
}
