<?php

declare(strict_types=1);

use App\Enums\AccountType;
use App\Enums\Currency;
use App\Models\Account;
use App\Models\Bank;
use App\Models\User;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\assertDatabaseHas;
use function Pest\Laravel\assertDatabaseMissing;
use function Pest\Laravel\post;

test('user can create an account via http', function () {
    // Arrange
    $user = User::factory()->create();
    $bank = Bank::factory()->create();

    $accountData = [
        'name'     => 'My Checking Account',
        'number'   => '123456789',
        'currency' => Currency::BRL->value,
        'type'     => AccountType::CHECKING->value,
        'bank_id'  => $bank->id,
    ];

    // Act
    $response = actingAs($user)->post(route('accounts.store'), $accountData);

    // Assert
    $response->assertRedirectToRoute('accounts.index');
    $response->assertSessionHas('success', 'Account My Checking Account created successfully');

    assertDatabaseHas('accounts', [
        'user_id'  => $user->id,
        'name'     => 'My Checking Account',
        'number'   => '123456789',
        'currency' => Currency::BRL->value,
        'type'     => AccountType::CHECKING->value,
        'bank_id'  => $bank->id,
    ]);
});

test('unauthenticated user cannot create an account', function () {
    // Arrange
    $bank = Bank::factory()->create();
    $accountData = [
        'name'     => 'My Checking Account',
        'currency' => Currency::BRL->value,
        'type'     => AccountType::CHECKING->value,
        'bank_id'  => $bank->id,
    ];

    // Act
    $response = post(route('accounts.store'), $accountData);

    // Assert
    $response->assertRedirect(route('login'));
});

test('validation errors for creating an account', function () {
    // Arrange
    $user = User::factory()->create();

    // Act (missing required fields)
    $response = actingAs($user)->post(route('accounts.store'), []);

    // Assert
    $response->assertSessionHasErrors(['name', 'currency', 'type', 'bank_id']);
});

test('user can update their own account via http', function () {
    // Arrange
    $user = User::factory()->create();
    $bank = Bank::factory()->create();
    $account = Account::factory()->create([
        'user_id'  => $user->id,
        'currency' => Currency::BRL,
        'type'     => AccountType::CHECKING,
        'bank_id'  => $bank->id,
    ]);

    $updateData = [
        'name'     => 'Updated Account Name',
        'number'   => '987654321',
        'currency' => Currency::USD->value,
        'type'     => AccountType::SAVINGS->value,
        'bank_id'  => $bank->id,
    ];

    // Act
    $response = actingAs($user)->put(route('accounts.update', $account), $updateData);

    // Assert
    $response->assertRedirectToRoute('accounts.index');
    $response->assertSessionHas('success', 'Account Updated Account Name updated successfully');

    assertDatabaseHas('accounts', [
        'id'       => $account->id,
        'name'     => 'Updated Account Name',
        'number'   => '987654321',
        'currency' => Currency::USD->value,
        'type'     => AccountType::SAVINGS->value,
        'bank_id'  => $bank->id,
    ]);
});

test('user cannot update another user\'s account', function () {
    // Arrange
    $userA = User::factory()->create();
    $userB = User::factory()->create();
    $bank = Bank::factory()->create();
    $accountA = Account::factory()->create([
        'user_id'  => $userA->id,
        'currency' => Currency::BRL,
        'type'     => AccountType::CHECKING,
        'bank_id'  => $bank->id,
    ]);

    $updateData = [
        'name'     => 'Attempted Update',
        'number'   => '123',
        'currency' => Currency::BRL->value,
        'type'     => AccountType::CHECKING->value,
        'bank_id'  => $bank->id,
    ];

    // Act
    $response = actingAs($userB)->put(route('accounts.update', $accountA), $updateData);

    // Assert
    $response->assertForbidden();
    assertDatabaseHas('accounts', [
        'id'   => $accountA->id,
        'name' => $accountA->name, // Should not have changed
    ]);
});

test('user can delete their own account via http', function () {
    // Arrange
    $user = User::factory()->create();
    $account = Account::factory()->create([
        'user_id' => $user->id,
    ]);

    // Act
    $response = actingAs($user)->delete(route('accounts.destroy', $account));

    // Assert
    $response->assertRedirectToRoute('accounts.index');
    $response->assertSessionHas('success', 'Account '.$account->name.' deleted successfully');

    assertDatabaseMissing('accounts', [
        'id' => $account->id,
    ]);
});

test('user cannot delete another user\'s account', function () {
    // Arrange
    $userA = User::factory()->create();
    $userB = User::factory()->create();
    $accountA = Account::factory()->create([
        'user_id' => $userA->id,
    ]);

    // Act
    $response = actingAs($userB)->delete(route('accounts.destroy', $accountA));

    // Assert
    $response->assertForbidden();
    assertDatabaseHas('accounts', [
        'id' => $accountA->id,
    ]);
});
