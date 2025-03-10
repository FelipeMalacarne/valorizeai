<?php

declare(strict_types=1);

namespace Tests\Feature\Elastic;

use App\Domain\Transaction\Projections\Transaction;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

final class TransactionsImportTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed();

        $this->artisan('scout:delete-index', ['name' => 'App\Domain\Transaction\Projections\Transaction']);
    }

    protected function tearDown(): void
    {
        $this->artisan('scout:delete-index', ['name' => 'App\Domain\Transaction\Projections\Transaction']);

        parent::tearDown();
    }

    public function test_it_imports_a_transaction_to_elasticsearch(): void
    {
        $user = User::factory()->create();

        $transaction = Transaction::factory()
            ->fromUser($user)
            ->create();

        $this->artisan('scout:import', ['model' => 'App\Domain\Transaction\Projections\Transaction']);
        sleep(1);

        $raw = Transaction::search()->raw();
        $hits = $raw->hits();
        $count = $raw->count();

        $this->assertIsArray($hits);
        $this->assertEquals($count, Transaction::count());
        $this->assertGreaterThan(0, $count);
        $this->assertEquals($transaction->id, $hits[0]['_id']);
        $this->assertEquals($transaction->memo, $hits[0]['_source']['memo']);
        $this->assertEquals($transaction->amount, $hits[0]['_source']['amount']);
        $this->assertEquals($transaction->categories->pluck('id')->toArray(), $hits[0]['_source']['categories']);
        $this->assertEquals($transaction->account->user->id, $hits[0]['_source']['user_id']);
    }

    public function test_it_imports_multiple_transactions_to_elasticsearch(): void
    {
        $user = User::factory()->create();

        $transactions = Transaction::factory()
            ->fromUser($user)
            ->count(50)
            ->create();

        $this->artisan('scout:import', ['model' => 'App\Domain\Transaction\Projections\Transaction']);
        sleep(1);

        $raw = Transaction::search()->raw();
        $hits = $raw->hits();
        $count = $raw->count();

        $this->assertIsArray($hits);
        $this->assertGreaterThan(0, $count);
        $this->assertEquals($count, Transaction::count());
    }
}
