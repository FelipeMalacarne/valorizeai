<?php

declare(strict_types=1);

use App\Models\User;
use function Pest\Laravel\postJson;

test('k6 load test endpoint provisions a seeded user and returns a token', function () {
    $response = postJson('/api/testing/load-test-user')
        ->assertCreated()
        ->assertJsonStructure([
            'token',
            'user_id',
            'email',
            'expires_at',
        ]);

    $userId = $response->json('user_id');
    $user = User::find($userId);

    expect($user)->not->toBeNull();
    expect($user?->accounts()->count())->toBeGreaterThan(0);
    expect($user?->categories()->count())->toBeGreaterThan(0);
});
