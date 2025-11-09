<?php

declare(strict_types=1);

use App\Enums\Currency;
use App\Models\Account;
use App\Models\Category;
use App\Models\Transaction;
use App\Models\User;
use App\ValueObjects\Money;
use Laravel\Sanctum\Sanctum;
use function Pest\Laravel\deleteJson;
use function Pest\Laravel\getJson;
use function Pest\Laravel\postJson;
use function Pest\Laravel\putJson;

test('authenticated users can list only their transactions', function () {
    $user = User::factory()->create();
    $category = Category::factory()->for($user)->create();
    $account = Account::factory()->for($user)->create([
        'currency' => Currency::BRL,
    ]);

    $mine = Transaction::factory()->count(2)
        ->for($account)
        ->for($category)
        ->create([
            'currency' => $account->currency,
            'amount'   => new Money(1500, $account->currency),
        ]);

    $otherTransaction = Transaction::factory()->create();

    Sanctum::actingAs($user);

    $response = getJson(route('api.transactions.index'));

    $response->assertOk();
    expect($response->json('data'))->toBeArray();

    $ids = collect($response->json('data'))->pluck('id')->all();
    expect($ids)->toEqualCanonicalizing($mine->pluck('id')->all());
    expect($ids)->not->toContain($otherTransaction->id);
});

test('users can view a single transaction via the api', function () {
    $user = User::factory()->create();
    $category = Category::factory()->for($user)->create();
    $account = Account::factory()->for($user)->create();
    $transaction = Transaction::factory()->for($account)->for($category)->create();

    Sanctum::actingAs($user);

    getJson(route('api.transactions.show', $transaction))
        ->assertOk()
        ->assertJsonPath('id', $transaction->id);
});

test('users can create transactions via the api', function () {
    $user = User::factory()->create([
        'preferred_currency' => Currency::BRL,
    ]);
    $category = Category::factory()->for($user)->create();
    $account = Account::factory()->for($user)->create([
        'currency' => Currency::BRL,
    ]);

    Sanctum::actingAs($user);

    $payload = [
        'account_id'  => $account->id,
        'category_id' => $category->id,
        'amount'      => [
            'value'    => 2500,
            'currency' => $account->currency->value,
        ],
        'date' => now()->toDateString(),
        'memo' => 'Groceries',
    ];

    $response = postJson(route('api.transactions.store'), $payload)
        ->assertCreated()
        ->assertJsonPath('memo', 'Groceries')
        ->assertJsonPath('account.id', $account->id)
        ->assertJsonPath('category.id', $category->id);

    expect(Transaction::where('id', $response->json('id'))->where('account_id', $account->id)->exists())->toBeTrue();
});

test('users can update their transactions via the api', function () {
    $user = User::factory()->create();
    $category = Category::factory()->for($user)->create();
    $account = Account::factory()->for($user)->create();
    $transaction = Transaction::factory()->for($account)->for($category)->create([
        'memo' => 'Before',
    ]);
    $newCategory = Category::factory()->for($user)->create();

    Sanctum::actingAs($user);

    $payload = [
        'amount' => [
            'value'    => 5000,
            'currency' => $account->currency->value,
        ],
        'date'        => now()->addDay()->toDateString(),
        'memo'        => 'Updated memo',
        'category_id' => $newCategory->id,
    ];

    putJson(route('api.transactions.update', $transaction), $payload)
        ->assertOk()
        ->assertJsonPath('memo', 'Updated memo')
        ->assertJsonPath('category.id', $newCategory->id);

    $transaction->refresh();
    expect($transaction->memo)->toBe('Updated memo');
    expect($transaction->category_id)->toBe($newCategory->id);
});

test('users can delete their transactions via the api', function () {
    $user = User::factory()->create();
    $category = Category::factory()->for($user)->create();
    $account = Account::factory()->for($user)->create();
    $transaction = Transaction::factory()->for($account)->for($category)->create();

    Sanctum::actingAs($user);

    deleteJson(route('api.transactions.destroy', $transaction))
        ->assertNoContent();

    expect(Transaction::find($transaction->id))->toBeNull();
});

test('users cannot access transactions owned by others', function () {
    $owner = User::factory()->create();
    $account = Account::factory()->for($owner)->create();
    $category = Category::factory()->for($owner)->create();
    $transaction = Transaction::factory()->for($account)->for($category)->create();
    $intruder = User::factory()->create();

    Sanctum::actingAs($intruder);

    getJson(route('api.transactions.show', $transaction))
        ->assertForbidden();
});
