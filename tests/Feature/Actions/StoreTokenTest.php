<?php

declare(strict_types=1);

use App\Actions\User\StoreToken;
use App\Http\Requests\User\StoreTokenRequest;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('successfully stores the token', function () {
    /** @var User $user */
    $user = User::factory()->create();

    $action = app(StoreToken::class);

    $args = new StoreTokenRequest('Test Token');

    $response = $action->handle($args, $user);

    expect($response)->toBeString();

    $this->assertDatabaseHas('personal_access_tokens', [
        'name'           => 'Test Token',
        'tokenable_id'   => $user->id,
        'tokenable_type' => User::class,
    ]);
});

it('stores the token with expiration', function () {
    /** @var User $user */
    $user = User::factory()->create();

    $action = app(StoreToken::class);

    $args = new StoreTokenRequest('Expiring Token', 10);

    $response = $action->handle($args, $user);

    expect($response)->toBeString();

    $this->assertDatabaseHas('personal_access_tokens', [
        'name'           => 'Expiring Token',
        'tokenable_id'   => $user->id,
        'tokenable_type' => User::class,
        'expires_at'     => now()->addDays(10)->toDateTimeString(),
    ]);
});
