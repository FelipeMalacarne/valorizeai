<?php

declare(strict_types=1);

use App\Actions\StoreAccount;
use App\Enums\AccountType;
use App\Enums\Color;
use App\Enums\Currency;
use App\Http\Requests\StoreAccountRequest;
use App\Models\Organization;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('Stores the account successfuly', function () {

    $organization = Organization::factory()->create();

    $data = StoreAccountRequest::from([
        'name'        => 'Test Account',
        'bank_code'   => '123',
        'currency'    => Currency::BRL,
        'color'       => Color::LAVENDER,
        'type'        => AccountType::CHECKING,
        'description' => 'Test description',
        'oganization' => $organization,
    ]);

    $action = app(StoreAccount::class);

    $account = $action->handle($data);

    expect($account->name)->toBe('Test Account');
    expect($account->bank_code)->toBe('123');
    expect($account->currency)->toBe(Currency::BRL);
    expect($account->color)->toBe(Color::LAVENDER);
    expect($account->type)->toBe(AccountType::CHECKING);
    expect($account->description)->toBe('Test description');

    $this->assertDatabaseHas('accounts', [
        'name'        => 'Test Account',
        'bank_code'   => '123',
        'currency'    => Currency::BRL,
        'color'       => Color::LAVENDER,
        'type'        => AccountType::CHECKING,
        'description' => 'Test description',
    ]);
});
