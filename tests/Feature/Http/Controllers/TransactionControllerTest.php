<?php

use App\Models\Account;
use App\Models\User;
use App\Enums\Currency;
use App\Enums\TransactionType;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\post;
use function Pest\Laravel\assertDatabaseHas;


test('user can create a transaction via http', function () {
    // Arrange
    $user = User::factory()->create();
    $account = Account::factory()->create([
        'user_id' => $user->id,
        'currency' => Currency::BRL,
        'balance' => 50000, // R$500,00
    ]);

    $transactionData = [
        'account_id'  => $account->id,
        'amount'      => [
            'amount' => -15000, // -R$150,00
            'currency' => 'BRL',
        ],
        'type'        => 'debit',
        'date'        => now()->toIso8601String(),
        'memo'        => 'HTTP Transaction Test',
    ];

    // Act
    $response = actingAs($user)->post(route('transactions.store'), $transactionData);

    // Assert
    $response->assertRedirect(route('transactions.index'));
    $response->assertSessionHas('success', 'Transaction created successfully');

    assertDatabaseHas('transactions', [
        'account_id' => $account->id,
        'memo' => 'HTTP Transaction Test',
        'amount' => -15000,
    ]);

    // Check that the balance was updated correctly
    $account->refresh();
    expect($account->balance->value)->toBe(35000); // 50000 - 15000
});

test('unauthenticated user cannot create a transaction', function () {
    // Arrange
    $account = Account::factory()->create();
    $transactionData = ['amount' => -100];

    // Act
    $response = post(route('transactions.store'), $transactionData);

    // Assert
    $response->assertRedirect(route('login'));
});
