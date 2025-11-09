<?php

declare(strict_types=1);

use App\Enums\Currency;
use App\Models\Budget;
use App\Models\Category;
use App\Models\User;
use Laravel\Sanctum\Sanctum;
use function Pest\Laravel\deleteJson;
use function Pest\Laravel\getJson;
use function Pest\Laravel\postJson;
use function Pest\Laravel\putJson;

test('authenticated users can list only their budgets', function () {
    $user = User::factory()->create([
        'preferred_currency' => Currency::BRL,
    ]);

    $categories = Category::factory()->count(2)->for($user)->create();

    $budgets = $categories->map(fn (Category $category) => Budget::factory()
        ->for($user)
        ->create([
            'category_id' => $category->id,
            'currency'    => $user->preferred_currency,
        ]));

    Budget::factory()->create(); // other user

    Sanctum::actingAs($user);

    $response = getJson(route('api.budgets.index'));

    $response->assertOk();

    $ids = collect($response->json())->pluck('id')->all();
    expect($ids)->toEqualCanonicalizing($budgets->pluck('id')->all());
});

test('users can view a single budget via the api', function () {
    $user = User::factory()->create([
        'preferred_currency' => Currency::USD,
    ]);
    $category = Category::factory()->for($user)->create();
    $budget = Budget::factory()->for($user)->create([
        'category_id' => $category->id,
        'currency'    => $user->preferred_currency,
    ]);

    Sanctum::actingAs($user);

    getJson(route('api.budgets.show', $budget))
        ->assertOk()
        ->assertJsonPath('id', $budget->id);
});

test('users can create budgets via the api', function () {
    $user = User::factory()->create([
        'preferred_currency' => Currency::EUR,
    ]);
    $category = Category::factory()->for($user)->create();

    Sanctum::actingAs($user);

    $payload = [
        'category_id' => $category->id,
        'name'        => 'Groceries Budget',
    ];

    $response = postJson(route('api.budgets.store'), $payload)
        ->assertCreated()
        ->assertJsonPath('name', 'Groceries Budget')
        ->assertJsonPath('category.id', $category->id);

    expect(Budget::where('id', $response->json('id'))->where('user_id', $user->id)->exists())->toBeTrue();
});

test('users can update their budgets via the api', function () {
    $user = User::factory()->create();
    $category = Category::factory()->for($user)->create();
    $budget = Budget::factory()->for($user)->create([
        'name'        => 'Original Budget',
        'category_id' => $category->id,
    ]);

    Sanctum::actingAs($user);

    putJson(route('api.budgets.update', $budget), [
        'name' => 'Updated Budget',
    ])
        ->assertOk()
        ->assertJsonPath('name', 'Updated Budget');

    $budget->refresh();
    expect($budget->name)->toBe('Updated Budget');
});

test('users can delete their budgets via the api', function () {
    $user = User::factory()->create();
    $category = Category::factory()->for($user)->create();
    $budget = Budget::factory()->for($user)->create([
        'category_id' => $category->id,
    ]);

    Sanctum::actingAs($user);

    deleteJson(route('api.budgets.destroy', $budget))
        ->assertNoContent();

    expect(Budget::find($budget->id))->toBeNull();
});

test('users cannot view budgets owned by others', function () {
    $owner = User::factory()->create();
    $category = Category::factory()->for($owner)->create();
    $budget = Budget::factory()->for($owner)->create([
        'category_id' => $category->id,
    ]);
    $intruder = User::factory()->create();

    Sanctum::actingAs($intruder);

    getJson(route('api.budgets.show', $budget))
        ->assertForbidden();
});
