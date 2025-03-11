<?php

declare(strict_types=1);

namespace Tests\Feature\Queries;

use App\Domain\Account\Projections\Account;
use App\Domain\Account\Queries\ListAccountsQuery;
use App\Domain\Account\Queries\ListAccountsQueryHandler;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

final class ListAccountsQueryTest extends TestCase
{
    use RefreshDatabase;

    protected $seed = true;

    public function test_it_returns_a_list_of_accounts(): void
    {
        $user = User::factory()->create();

        $accounts = Account::factory(5)->create([
            'user_id' => $user->id,
        ]);
        sleep(1);

        $query = new ListAccountsQuery(userId: $user->id);
        $handler = new ListAccountsQueryHandler();
        $result = $handler->handle($query);

        $this->assertEquals($accounts->count(), $result->count());
        $this->assertEquals($accounts->first()->id, $result->first()->id);
        $this->assertEquals($accounts->last()->id, $result->last()->id);
    }
}
