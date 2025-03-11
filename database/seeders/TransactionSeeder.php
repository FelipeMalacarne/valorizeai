<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Domain\Account\Projections\Account;
use App\Domain\Transaction\Projections\Transaction;
use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\EventSourcing\StoredEvents\StoredEvent;

final class TransactionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::factory()->create([
            'name'  => 'Felipe',
            'email' => 'felipemalacarne012@gmail.com',
        ]);

        Transaction::factory()
            ->withRandomCategories()
            ->for(Account::factory()->state(['user_id' => $user->id]))
            ->count(100)
            ->create();

        Transaction::factory()
            ->withRandomCategories()
            ->for(Account::factory()->state(['user_id' => $user->id]))
            ->count(50)
            ->create();

        Transaction::factory()
            ->withRandomCategories()
            ->for(Account::factory()->state(['user_id' => $user->id]))
            ->count(500)
            ->create();
    }
}
