<?php

declare(strict_types=1);

use App\Enums\AccountType;
use App\Enums\Currency;
use App\Models\Account;
use App\Models\Bank;
use App\Models\User;
use Laravel\Sanctum\Sanctum;
use function Pest\Laravel\deleteJson;
use function Pest\Laravel\getJson;
use function Pest\Laravel\postJson;
use function Pest\Laravel\putJson;

test('authenticated users can list only their accounts', function () {
    $user = User::factory()->create();
    $bank = Bank::factory()->create();
    $mine = Account::factory()->count(2)->for($user)->for($bank)->create();
    $otherAccount = Account::factory()->create();

    Sanctum::actingAs($user);

    $response = getJson(route('api.accounts.index'));

    $response->assertOk();

    $ids = collect($response->json('data'))->pluck('id')->all();

    expect($ids)->toEqualCanonicalizing($mine->pluck('id')->all());
    expect($ids)->not->toContain($otherAccount->id);
});

test('users can retrieve a single account resource', function () {
    $user = User::factory()->create();
    $account = Account::factory()->for($user)->create();

    Sanctum::actingAs($user);

    getJson(route('api.accounts.show', $account))
        ->assertOk()
        ->assertJsonPath('id', $account->id);
});

test('users cannot view accounts that belong to others', function () {
    $owner = User::factory()->create();
    $account = Account::factory()->for($owner)->create();
    $intruder = User::factory()->create();

    Sanctum::actingAs($intruder);

    getJson(route('api.accounts.show', $account))
        ->assertForbidden();
});

test('users can create accounts via the api', function () {
    $user = User::factory()->create();
    $bank = Bank::factory()->create();

    Sanctum::actingAs($user);

    $payload = [
        'name'     => 'Main Checking',
        'number'   => '001122',
        'currency' => Currency::BRL->value,
        'type'     => AccountType::CHECKING->value,
        'bank_id'  => $bank->id,
    ];

    $response = postJson(route('api.accounts.store'), $payload)
        ->assertCreated()
        ->assertJsonFragment([
            'name' => 'Main Checking',
        ])
        ->assertJsonPath('bank.id', $bank->id);

    $createdId = $response->json('id');

    expect(Account::where('id', $createdId)->where('user_id', $user->id)->exists())->toBeTrue();
});

test('users can update their accounts via the api', function () {
    $user = User::factory()->create();
    $account = Account::factory()->for($user)->create([
        'name' => 'Old Name',
    ]);
    $bank = Bank::factory()->create();

    Sanctum::actingAs($user);

    $payload = [
        'name'     => 'Updated Name',
        'number'   => '998877',
        'currency' => Currency::USD->value,
        'type'     => AccountType::SAVINGS->value,
        'bank_id'  => $bank->id,
    ];

    putJson(route('api.accounts.update', $account), $payload)
        ->assertOk()
        ->assertJsonPath('name', 'Updated Name')
        ->assertJsonPath('bank.id', $bank->id);

    $account->refresh();
    expect($account->name)->toBe('Updated Name');
    expect($account->bank_id)->toBe($bank->id);
});

test('users can delete their accounts via the api', function () {
    $user = User::factory()->create();
    $account = Account::factory()->for($user)->create();

    Sanctum::actingAs($user);

    deleteJson(route('api.accounts.destroy', $account))
        ->assertNoContent();

    expect(Account::find($account->id))->toBeNull();
});
