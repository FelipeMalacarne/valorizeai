<?php

declare(strict_types=1);

use App\Enums\Color;
use App\Models\Category;
use App\Models\User;
use Laravel\Sanctum\Sanctum;
use function Pest\Laravel\deleteJson;
use function Pest\Laravel\getJson;
use function Pest\Laravel\postJson;
use function Pest\Laravel\putJson;

test('authenticated users can list only their categories', function () {
    $user = User::factory()->create();
    $categories = Category::factory()->count(2)->for($user)->create();
    $other = Category::factory()->create(); // belongs to another user

    Sanctum::actingAs($user);

    $response = getJson(route('api.categories.index'));

    $response->assertOk();

    $ids = collect($response->json())->pluck('id')->all();
    expect($ids)->toEqualCanonicalizing($categories->pluck('id')->all());
    expect($ids)->not->toContain($other->id);
});

test('users can view a single category via the api', function () {
    $user = User::factory()->create();
    $category = Category::factory()->for($user)->create();

    Sanctum::actingAs($user);

    getJson(route('api.categories.show', $category))
        ->assertOk()
        ->assertJsonPath('id', $category->id);
});

test('users can create categories via the api', function () {
    $user = User::factory()->create();

    Sanctum::actingAs($user);

    $payload = [
        'name'        => 'Travel',
        'description' => 'Trips and vacations',
        'color'       => Color::BLUE->value,
        'is_default'  => false,
    ];

    $response = postJson(route('api.categories.store'), $payload)
        ->assertCreated()
        ->assertJsonFragment([
            'name'  => 'Travel',
            'color' => Color::BLUE->value,
        ]);

    $createdId = $response->json('id');
    expect(Category::where('id', $createdId)->where('user_id', $user->id)->exists())->toBeTrue();
});

test('users can update their categories via the api', function () {
    $user = User::factory()->create();
    $category = Category::factory()->for($user)->create([
        'name' => 'Old Category',
    ]);

    Sanctum::actingAs($user);

    $payload = [
        'name'        => 'Updated Category',
        'description' => 'Updated notes',
        'color'       => Color::GREEN->value,
        'is_default'  => false,
    ];

    putJson(route('api.categories.update', $category), $payload)
        ->assertOk()
        ->assertJsonPath('name', 'Updated Category')
        ->assertJsonPath('color', Color::GREEN->value);

    $category->refresh();
    expect($category->name)->toBe('Updated Category');
});

test('users cannot modify categories owned by others', function () {
    $owner = User::factory()->create();
    $category = Category::factory()->for($owner)->create();
    $intruder = User::factory()->create();

    Sanctum::actingAs($intruder);

    putJson(route('api.categories.update', $category), [
        'name'        => 'Hacked',
        'description' => null,
        'color'       => Color::RED->value,
        'is_default'  => false,
    ])->assertForbidden();
});

test('users can delete their categories via the api', function () {
    $user = User::factory()->create();
    $category = Category::factory()->for($user)->create();

    Sanctum::actingAs($user);

    deleteJson(route('api.categories.destroy', $category))
        ->assertNoContent();

    expect(Category::find($category->id))->toBeNull();
});
