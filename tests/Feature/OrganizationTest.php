<?php

declare(strict_types=1);

use App\Enums\Currency;
use App\Enums\OrganizationRole;
use App\Models\Organization;
use App\Models\User;

test('it can create an organization', function () {
    $organization = Organization::factory()->create();

    expect($organization->id)->toBeUuid()
        ->and($organization->name)->toBeString()
        ->and($organization->preferred_currency)->toBeInstanceOf(Currency::class)
        ->and($organization)->toBeInstanceOf(Organization::class);
});

test('it can have users with different roles', function () {
    $organization = Organization::factory()->create();
    $user = User::factory()->create();

    $organization->addUser($user, OrganizationRole::ADMIN);

    expect($organization->users)->toHaveCount(1)
        ->and($organization->users->first()->pivot->role)->toBe(OrganizationRole::ADMIN)
        ->and($organization->users->first()->pivot->role->label())->toBe('Admin');
});

test('user can belong to multiple organizations with different roles', function () {
    $user = User::factory()->create();
    $organization1 = Organization::factory()->create();
    $organization2 = Organization::factory()->create();

    $organization1->addUser($user, OrganizationRole::OWNER);
    $organization2->addUser($user, OrganizationRole::MEMBER);

    expect($user->organizations)->toHaveCount(2)
        ->and($user->organizations->first()->pivot->role)->toBe(OrganizationRole::OWNER)
        ->and($user->organizations->last()->pivot->role)->toBe(OrganizationRole::MEMBER);
});

test('it can create an organization with specific currency', function () {
    $organization = Organization::factory()->create([
        'preferred_currency' => Currency::BRL,
    ]);

    expect($organization->preferred_currency)->toBe(Currency::BRL);
});
