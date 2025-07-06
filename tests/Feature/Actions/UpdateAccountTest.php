<?php

declare(strict_types=1);

use App\Actions\Account\UpdateAccount;
use App\Enums\AccountType;
use App\Http\Requests\Account\UpdateAccountRequest;
use App\Models\Account;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('it updates the account name', function () {

    $account = Account::factory()->create();

    $data = new UpdateAccountRequest(name: 'updated');

    $action = app(UpdateAccount::class);

    $account = $action->handle($data, $account);

    $this->assertDatabaseHas('accounts', [
        'id'   => $account->id,
        'name' => 'updated',
    ]);

    $this->assertEquals('updated', $account->name);
});

test('it updates the account number', function () {

    $account = Account::factory()->create();

    $data = new UpdateAccountRequest(number: '123456789');
    $action = app(UpdateAccount::class);
    $account = $action->handle($data, $account);

    $this->assertDatabaseHas('accounts', [
        'id'     => $account->id,
        'number' => '123456789',
    ]);
    $this->assertEquals('123456789', $account->number);
});

test('it updates the account type', function () {

    $account = Account::factory()->create();

    $data = new UpdateAccountRequest(type: AccountType::SAVINGS);
    $action = app(UpdateAccount::class);
    $account = $action->handle($data, $account);

    $this->assertDatabaseHas('accounts', [
        'id'   => $account->id,
        'type' => 'savings',
    ]);
    $this->assertEquals('savings', $account->type->value);
});
test('it updates the account with all fields', function () {

    $account = Account::factory()->create();

    $data = new UpdateAccountRequest(
        name: 'updated',
        number: '123456789',
        type: AccountType::SAVINGS,
    );

    $action = app(UpdateAccount::class);
    $account = $action->handle($data, $account);

    $this->assertDatabaseHas('accounts', [
        'id'     => $account->id,
        'name'   => 'updated',
        'number' => '123456789',
        'type'   => 'savings',
    ]);

    $this->assertEquals('updated', $account->name);
    $this->assertEquals('123456789', $account->number);
    $this->assertEquals('savings', $account->type->value);
});

test('it does not update the account if no data is provided', function () {

    $account = Account::factory()->create();

    $data = new UpdateAccountRequest();

    $action = app(UpdateAccount::class);
    $account = $action->handle($data, $account);

    $this->assertDatabaseHas('accounts', [
        'id'     => $account->id,
        'name'   => $account->name,
        'number' => $account->number,
        'type'   => $account->type->value,
    ]);

    $this->assertEquals($account->name, $account->name);
    $this->assertEquals($account->number, $account->number);
    $this->assertEquals($account->type->value, $account->type->value);
});
