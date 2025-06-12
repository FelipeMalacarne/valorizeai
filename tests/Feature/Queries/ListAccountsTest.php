<?php

declare(strict_types=1);

use App\Http\Requests\Account\IndexAccountsRequest;
use App\Models\Account;
use App\Models\User;
use App\Queries\ListAccountsQuery;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('it returns user accounts paginated', function () {
    $user = User::factory()->create();

    Account::factory()
        ->count(5)
        ->for($user)
        ->create();

    Account::factory()
        ->count(3)
        ->create(); // Create some accounts not associated with the user

    $query = app(ListAccountsQuery::class);

    $data = new IndexAccountsRequest();

    $result = $query->handle($data, $user);

    expect($result)
        ->toBeInstanceOf(Illuminate\Pagination\LengthAwarePaginator::class)
        ->and($result->count())->toBe(5)
        ->and($result->first()->user_id)->toBe($user->id);

});
