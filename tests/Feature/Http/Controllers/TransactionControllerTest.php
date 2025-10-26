<?php

declare(strict_types=1);

use App\Enums\Currency;
use App\Enums\TransactionType;
use App\Events\Transaction\TransactionCreated;
use App\Models\Account;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Support\Facades\Event;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\assertDatabaseHas;
use function Pest\Laravel\assertDatabaseMissing;
use function Pest\Laravel\post;

test('user can create a transaction via http', function () {
    // Arrange
    Event::fake();
    $user = User::factory()->create();
    $account = Account::factory()->create([
        'user_id'  => $user->id,
        'currency' => Currency::BRL,
        'balance'  => 50000, // R$500,00
    ]);

    $transactionData = [
        'account_id' => $account->id,
        'amount'     => [
            'value'    => -15000, // -R$150,00
            'currency' => 'BRL',
        ],
        'type' => 'debit',
        'date' => now()->toIso8601String(),
        'memo' => 'HTTP Transaction Test',
    ];

    // Act
    $response = actingAs($user)->post(route('transactions.store'), $transactionData);

    // Assert
    $response->assertRedirectBack();
    $response->assertSessionHas('success', 'Transaction created successfully');

    assertDatabaseHas('transactions', [
        'account_id' => $account->id,
        'memo'       => 'HTTP Transaction Test',
        'amount'     => -15000,
    ]);

    Event::assertDispatched(TransactionCreated::class);
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

test('user can delete their own transaction', function () {
    // Arrange
    $user = User::factory()->create();
    $account = Account::factory()->create([
        'user_id'  => $user->id,
        'currency' => Currency::BRL,
        'balance'  => 50000, // R$500,00
    ]);
    $transaction = Transaction::factory()->create([
        'account_id' => $account->id,
        'amount'     => -10000, // -R$100,00
        'currency'   => Currency::BRL,
    ]);

    // Act
    $response = actingAs($user)->delete(route('transactions.destroy', $transaction));

    // Assert
    $response->assertRedirectToRoute('transactions.index');
    $response->assertSessionHas('success', 'Transaction deleted successfully.');

    assertDatabaseMissing('transactions', [
        'id' => $transaction->id,
    ]);

    // Check that the balance was reverted correctly
    $account->refresh();
    expect($account->balance->value)->toBe(60000); // 50000 - (-10000) = 60000
});

test('user cannot delete another user\'s transaction', function () {
    // Arrange
    $userA = User::factory()->create();
    $userB = User::factory()->create();
    $accountA = Account::factory()->create([
        'user_id'  => $userA->id,
        'currency' => Currency::BRL,
    ]);
    $transactionA = Transaction::factory()->create([
        'account_id' => $accountA->id,
        'currency'   => Currency::BRL,
    ]);

    // Act
    $response = actingAs($userB)->delete(route('transactions.destroy', $transactionA));

    // Assert
    $response->assertForbidden();
    assertDatabaseHas('transactions', [
        'id' => $transactionA->id,
    ]);
});

test('user can update their own transaction', function () {
    // Arrange
    $user = User::factory()->create();
    $account = Account::factory()->create([
        'user_id'  => $user->id,
        'currency' => Currency::BRL,
        'balance'  => 50000, // R$500,00
    ]);
    $transaction = Transaction::factory()->create([
        'account_id'  => $account->id,
        'amount'      => -10000, // -R$100,00
        'currency'    => Currency::BRL,
        'type'        => TransactionType::DEBIT->value,
        'date'        => now(),
        'memo'        => 'Original memo',
        'category_id' => null,
    ]);

    $updateData = [
        'amount' => [
            'value'    => -5000, // New amount: -R$50,00
            'currency' => 'BRL',
        ],
        'type'        => TransactionType::DEBIT->value,
        'date'        => now()->toIso8601String(),
        'memo'        => 'Updated memo',
        'category_id' => null,
    ];

    // Act
    $response = actingAs($user)->put(route('transactions.update', $transaction), $updateData);

    // Assert
    $response->assertRedirectBack();
    $response->assertSessionHas('success', 'Transaction updated successfully.');

    assertDatabaseHas('transactions', [
        'id'     => $transaction->id,
        'memo'   => 'Updated memo',
        'amount' => -5000,
    ]);

    // Check that the balance was updated correctly: 50000 (initial) - (-10000) (old) + (-5000) (new) = 55000
    $account->refresh();
    expect($account->balance->value)->toBe(55000);
});

test('user cannot update another user\'s transaction', function () {
    // Arrange
    $userA = User::factory()->create();
    $userB = User::factory()->create();
    $accountA = Account::factory()->create([
        'user_id'  => $userA->id,
        'currency' => Currency::BRL,
    ]);
    $transactionA = Transaction::factory()->create([
        'account_id' => $accountA->id,
        'currency'   => Currency::BRL,
        'type'       => TransactionType::DEBIT->value,
        'date'       => now(),
        'memo'       => 'Original memo',
        'amount'     => -10000,
    ]);

    $updateData = [
        'amount' => [
            'value'    => -5000, // New amount: -R$50,00
            'currency' => 'BRL',
        ],
        'type'        => TransactionType::DEBIT->value,
        'date'        => now()->toIso8601String(),
        'memo'        => 'Attempted update',
        'category_id' => null,
    ];

    // Act
    $response = actingAs($userB)->put(route('transactions.update', $transactionA), $updateData);

    // Assert
    $response->assertForbidden();
    assertDatabaseHas('transactions', [
        'id'   => $transactionA->id,
        'memo' => 'Original memo', // Memo should not have changed
    ]);
});
