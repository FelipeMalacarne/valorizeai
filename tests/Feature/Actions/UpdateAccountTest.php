<?php

declare(strict_types=1);

use App\Actions\Account\UpdateAccount;
use App\Enums\AccountType;
use App\Enums\Currency;
use App\Http\Requests\Account\UpdateAccountRequest;
use App\Models\Account;
use App\Models\Bank;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('it updates the account with full data', function () {
    $account = Account::factory()->create();
    $bank = Bank::factory()->create();

    $data = new UpdateAccountRequest(
        name: 'Updated Name',
        number: '987654321',
        currency: Currency::EUR,
        type: AccountType::SAVINGS,
        bank_id: $bank->id,
    );

    $action = app(UpdateAccount::class);
    $updatedAccount = $action->handle($data, $account);

    $this->assertDatabaseHas('accounts', [
        'id'       => $updatedAccount->id,
        'name'     => 'Updated Name',
        'number'   => '987654321',
        'currency' => Currency::EUR->value,
        'type'     => AccountType::SAVINGS->value,
        'bank_id'  => $bank->id,
    ]);

    $this->assertEquals('Updated Name', $updatedAccount->name);
    $this->assertEquals('987654321', $updatedAccount->number);
    $this->assertEquals(Currency::EUR, $updatedAccount->currency);
    $this->assertEquals(AccountType::SAVINGS, $updatedAccount->type);
    $this->assertEquals($bank->id, $updatedAccount->bank_id);
});

test('it updates the account with only some fields changed', function () {
    $account = Account::factory()->create([
        'name'     => 'Original Name',
        'number'   => '111111111',
        'currency' => Currency::USD,
        'type'     => AccountType::CHECKING,
    ]);
    $bank = Bank::factory()->create();

    // Send full data, but only change the name
    $data = new UpdateAccountRequest(
        name: 'New Name',
        number: $account->number,
        currency: $account->currency,
        type: $account->type,
        bank_id: $account->bank_id,
    );

    $action = app(UpdateAccount::class);
    $updatedAccount = $action->handle($data, $account);

    $this->assertDatabaseHas('accounts', [
        'id'       => $updatedAccount->id,
        'name'     => 'New Name',
        'number'   => '111111111',
        'currency' => Currency::USD->value,
        'type'     => AccountType::CHECKING->value,
        'bank_id'  => $account->bank_id,
    ]);

    $this->assertEquals('New Name', $updatedAccount->name);
    $this->assertEquals('111111111', $updatedAccount->number);
    $this->assertEquals(Currency::USD, $updatedAccount->currency);
    $this->assertEquals(AccountType::CHECKING, $updatedAccount->type);
    $this->assertEquals($account->bank_id, $updatedAccount->bank_id);
});
