<?php

declare(strict_types=1);

use App\Enums\Currency;
use App\Models\Transaction;
use App\ValueObjects\Money;

test('it creates the transaction', function () {
    $transaction = Transaction::factory()->create([
        'amount' => new Money(10000, Currency::BRL),
        'memo'   => 'Test Transaction',
        'date'   => now(),
    ]);

    expect($transaction)->toBeInstanceOf(Transaction::class);
    expect($transaction->amount)->toEqual(new Money(10000, Currency::BRL));
    expect($transaction->memo)->toBe('Test Transaction');

    $this->assertDatabaseHas('transactions', [
        'id'     => $transaction->id,
        'amount' => 10000,
        'memo'   => 'Test Transaction',
    ]);
});
