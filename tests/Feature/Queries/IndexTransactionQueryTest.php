<?php

declare(strict_types=1);

namespace Tests\Feature\Queries;

use App\Domain\Account\Projections\Account;
use App\Domain\Category\Projections\Category;
use App\Domain\Transaction\Projections\Transaction;
use App\Domain\Transaction\Queries\IndexTransactionsQuery;
use App\Domain\Transaction\Queries\IndexTransactionsQueryHandler;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

final class IndexTransactionQueryTest extends TestCase
{
    use RefreshDatabase;

    protected $seed = true;

    public function test_it_returns_a_list_of_transactions(): void
    {
        $user = User::factory()->create();

        $transactions = Transaction::factory()
            ->fromUser($user)
            ->withRandomCategories()
            ->count(10)
            ->create();

        // wait for elastic indexing
        sleep(1);

        $handler = new IndexTransactionsQueryHandler;
        $query = new IndexTransactionsQuery(user_id: $user->id);

        $result = $handler->handle($query);
        $items = $result->getCollection();

        $this->assertIsArray($items->toArray());
        $this->assertCount(10, $items);

        $items->each(fn ($item) => $this->assertInstanceOf(Transaction::class, $item));

        // assert all are from the user
        $items->load('account.user');
        $items->each(function (Transaction $transaction) use ($user) {
            $this->assertEquals($user->id, $transaction->account->user->id);
        });
    }

    public function test_it_filters_by_category(): void
    {
        $user = User::factory()->create();

        $transactions = Transaction::factory()
            ->fromUser($user)
            ->withRandomCategories()
            ->count(10)
            ->create();

        $test_category = Category::factory()
            ->isDefault()
            ->create(['name' => 'Test Category']);

        $target_transactions = Transaction::factory()
            ->fromUser($user)
            ->count(3)
            ->create();

        $target_transactions
            ->each(fn ($transaction) => $transaction->categories()->attach($test_category))
            ->each(fn ($transaction) => $transaction->touch());

        // wait for elastic indexing
        sleep(1);

        $handler = new IndexTransactionsQueryHandler;
        $query = new IndexTransactionsQuery(
            user_id: $user->id,
            categories: [$test_category->id],
        );

        $result = $handler->handle($query);
        $items = $result->getCollection();

        $this->assertCount(3, $items);
    }

    public function test_it_filters_by_account(): void
    {
        $user = User::factory()->create();

        $account = Account::factory()->create(['user_id' => $user->id]);

        $transactions = Transaction::factory()
            ->fromUser($user)
            ->withRandomCategories()
            ->count(10)
            ->create();

        $target_transactions = Transaction::factory()
            ->fromUser($user)
            ->count(3)
            ->create([
                'account_id' => $account->id,
            ]);

        sleep(1);

        $handler = new IndexTransactionsQueryHandler;
        $query = new IndexTransactionsQuery(
            user_id: $user->id,
            accounts: [$account->id],
        );

        $result = $handler->handle($query);
        $items = $result->getCollection();

        $this->assertCount(3, $items);
    }
}
