<?php

declare(strict_types=1);

use App\Actions\Category\CreateCategory;
use App\Actions\Category\DeleteCategory;
use App\Actions\Category\UpdateCategory;
use App\Enums\Color;
use App\Http\Requests\Category\CreateCategoryRequest;
use App\Http\Requests\Category\UpdateCategoryRequest;
use App\Models\Category;
use App\Models\User;

test('user can create a category', function () {
    $user = User::factory()->create();

    $data = CreateCategoryRequest::from([
        'name'        => 'Test Category',
        'description' => 'A test category',
        'color'       => Color::BLUE,
        'is_default'  => false,
    ]);

    $category = app(CreateCategory::class)->handle($data, $user);

    expect($category)->toBeInstanceOf(Category::class);
    expect($category->name)->toBe('Test Category');
    expect($category->user_id)->toBe($user->id);
    expect($category->is_default)->toBeFalse();
});

test('user can update their own category', function () {
    $user = User::factory()->create();
    $category = Category::factory()->for($user)->create([
        'name' => 'Original Name',
    ]);

    $data = UpdateCategoryRequest::from([
        'name'        => 'Updated Name',
        'description' => 'Updated description',
        'color'       => Color::RED,
        'is_default'  => false,
    ]);

    $updatedCategory = app(UpdateCategory::class)->handle($data, $category);

    expect($updatedCategory->name)->toBe('Updated Name');
    expect($updatedCategory->description)->toBe('Updated description');
    expect($updatedCategory->color)->toBe(Color::RED);
});

test('user can delete their own category', function () {
    $user = User::factory()->create();
    $category = Category::factory()->for($user)->create();

    $result = app(DeleteCategory::class)->handle($category);

    expect($result)->toBeTrue();
    expect(Category::find($category->id))->toBeNull();
});

test('different users can have categories with the same name', function () {
    $user1 = User::factory()->create();
    $user2 = User::factory()->create();

    Category::factory()->for($user1)->create(['name' => 'Same Name']);

    $data = CreateCategoryRequest::from([
        'name'        => 'Same Name',
        'description' => 'Different user category',
        'color'       => Color::YELLOW,
        'is_default'  => false,
    ]);

    $category = app(CreateCategory::class)->handle($data, $user2);

    expect($category)->toBeInstanceOf(Category::class);
    expect($category->name)->toBe('Same Name');
    expect($category->user_id)->toBe($user2->id);
});

test('default categories can be viewed by all users', function () {
    $user = User::factory()->create();
    $defaultCategory = Category::factory()->default()->create();

    expect($user->can('view', $defaultCategory))->toBeTrue();
});

test('users cannot update or delete default categories', function () {
    $user = User::factory()->create();
    $defaultCategory = Category::factory()->default()->create();

    expect($user->can('update', $defaultCategory))->toBeFalse();
    expect($user->can('delete', $defaultCategory))->toBeFalse();
});

test('users cannot update or delete other users categories', function () {
    $user1 = User::factory()->create();
    $user2 = User::factory()->create();
    $category = Category::factory()->for($user2)->create();

    expect($user1->can('update', $category))->toBeFalse();
    expect($user1->can('delete', $category))->toBeFalse();
});
