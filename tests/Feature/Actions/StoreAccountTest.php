<?php

declare(strict_types=1);

use App\Actions\Account\StoreAccount;
use App\Enums\AccountType;
use App\Enums\Currency;
use App\Http\Requests\Account\StoreAccountRequest;
use App\Models\Bank;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('Stores the account successfuly', function () {

    $bank = Bank::factory()->create();

    $user = User::factory()->create();

    $data = StoreAccountRequest::from([
        'name'     => 'Test Account',
        'number'   => '12312312-1',
        'currency' => Currency::BRL,
        'type'     => AccountType::CHECKING,
        'bank_id'  => $bank->id,
    ]);

    $action = app(StoreAccount::class);

    $account = $action->handle($data, $user);

    expect($account->name)->toBe('Test Account');
    expect($account->number)->toBe('12312312-1');
    expect($account->currency)->toBe(Currency::BRL);
    expect($account->type)->toBe(AccountType::CHECKING);
    expect($account->bank_id)->toBe($bank->id);

    $this->assertDatabaseHas('accounts', [
        'name'     => 'Test Account',
        'number'   => '12312312-1',
        'currency' => Currency::BRL,
        'type'     => AccountType::CHECKING,
        'bank_id'  => $bank->id,
    ]);

});
