<?php

declare(strict_types=1);

use App\Models\Transaction;

test('it creates the transaction', function () {
    $transaction = Transaction::factory()->create([
        'amount' => 100,
        'memo'   => 'Test Transaction',
        'date'   => now(),
    ]);

    expect($transaction)->toBeInstanceOf(Transaction::class);
    expect($transaction->amount)->toBe(100);
    expect($transaction->memo)->toBe('Test Transaction');

    $this->assertDatabaseHas('transactions', [
        'id'     => $transaction->id,
        'amount' => 100,
        'memo'   => 'Test Transaction',
    ]);
});
