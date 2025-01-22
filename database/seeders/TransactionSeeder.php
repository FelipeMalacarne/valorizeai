<?php

namespace Database\Seeders;

use App\Domain\Transaction\Projections\Transaction;
use App\Models\User;
use Illuminate\Database\Seeder;

class TransactionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::factory()->create([
            'name' => 'Felipe',
            'email' => 'felipemalacarne012@gmail.com',
        ]);

        Transaction::factory()
            ->fromUser($user)
            ->count(10)
            ->create();
    }
}
