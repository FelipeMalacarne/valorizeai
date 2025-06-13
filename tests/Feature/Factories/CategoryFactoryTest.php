<?php

use App\Models\Category;

test('it creates the category', function () {
    $category = Category::factory()->create([
        'name' => 'Test Category',
        'description' => 'This is a test category.',
    ]);

    expect($category)->toBeInstanceOf(Category::class);

    $this->assertDatabaseHas('categories', [
        'id' => $category->id,
        'name' => 'Test Category',
        'description' => 'This is a test category.',
    ]);
});
