<?php

namespace Tests\Feature\Aggregates;

use App\Commands\AmendTransactionAmount;
use App\Commands\DeleteTransaction;
use App\Commands\RegisterTransaction;
use App\Models\Account;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Spatie\EventSourcing\Commands\CommandBus;
use Tests\TestCase;

class TransactionAggregateTest extends TestCase
{
    // use RefreshDatabase;

    /**
     * A basic feature test example.
     */
    public function test_register(): void
    {
        $uuid = Str::uuid7();

        $account = Account::factory()->create();

        $bus = app(CommandBus::class);

        $bus->dispatch(new RegisterTransaction(
            id: $uuid,
            amount: 5000,
            currency: 'BRL',
            accountId: $account->id,
            fitid: 'fitid',
            memo: 'Test transaction',
            datePosted: today(),
            accountNumber: '123456',
        ));

        $this->assertDatabaseHas('transactions', [
            'id'             => $uuid,
            'amount'         => 5000,
            'currency'       => 'BRL',
            'account_id'     => $account->id,
            'fitid'          => 'fitid',
            'memo'           => 'Test transaction',
            'date_posted'    => today(),
            'account_number' => '123456',
        ]);
    }

    public function test_delete(): void
    {
        $uuid = Str::uuid7();
        $account = Account::factory()->create();
        $bus = app(CommandBus::class);

        $bus->dispatch(new RegisterTransaction(
            id: $uuid,
            amount: 5000,
            currency: 'BRL',
            accountId: $account->id,
            fitid: 'fitid',
            memo: 'Test transaction',
            datePosted: today(),
            accountNumber: '123456',
        ));

        $this->assertDatabaseHas('transactions', [
            'id'             => $uuid,
            'amount'         => 5000,
            'currency'       => 'BRL',
            'account_id'     => $account->id,
            'fitid'          => 'fitid',
            'memo'           => 'Test transaction',
            'date_posted'    => today(),
            'account_number' => '123456',
        ]);

        $bus->dispatch(new DeleteTransaction($uuid));

        $this->assertDatabaseMissing('transactions', [
            'id'             => $uuid,
            'amount'         => 5000,
            'currency'       => 'BRL',
            'account_id'     => $account->id,
            'fitid'          => 'fitid',
            'memo'           => 'Test transaction',
            'date_posted'    => today(),
            'account_number' => '123456',
        ]);
    }

    public function test_amend_amount(): void
    {
        $uuid = Str::uuid7();
        $account = Account::factory()->create();
        $bus = app(CommandBus::class);
        $bus->dispatch(new RegisterTransaction(
            id: $uuid,
            amount: 5000,
            currency: 'BRL',
            accountId: $account->id,
            fitid: 'fitid',
            memo: 'Test transaction',
            datePosted: today(),
            accountNumber: '123456',
        ));
        $this->assertDatabaseHas('transactions', [
            'id'             => $uuid,
            'amount'         => 5000,
            'currency'       => 'BRL',
            'account_id'     => $account->id,
            'fitid'          => 'fitid',
            'memo'           => 'Test transaction',
            'date_posted'    => today(),
            'account_number' => '123456',
        ]);
        $bus->dispatch(new AmendTransactionAmount(
            id: $uuid,
            amount: 10000,
        ));
        $this->assertDatabaseHas('transactions', [
            'id'             => $uuid,
            'amount'         => 10000,
            'currency'       => 'BRL',
            'account_id'     => $account->id,
            'fitid'          => 'fitid',
            'memo'           => 'Test transaction',
            'date_posted'    => today(),
            'account_number' => '123456',
        ]);
    }

    public function test_account_balance_after_amend_amount(): void
    {
        $uuid = Str::uuid7();
        $account = Account::factory()->create([
            'balance' => 5000,
        ]);
        $bus = app(CommandBus::class);

        $bus->dispatch(new RegisterTransaction(
            id: $uuid,
            amount: 5000,
            currency: 'BRL',
            accountId: $account->id,
            fitid: 'fitid',
            memo: 'Test transaction',
            datePosted: today(),
            accountNumber: '123456',
        ));

        $this->assertDatabaseHas('transactions', [
            'id'             => $uuid,
            'amount'         => 5000,
            'currency'       => 'BRL',
            'account_id'     => $account->id,
            'fitid'          => 'fitid',
            'memo'           => 'Test transaction',
            'date_posted'    => today(),
            'account_number' => '123456',
        ]);

        $bus->dispatch(new AmendTransactionAmount(
            id: $uuid,
            amount: 10000,
        ));

        $this->assertDatabaseHas('transactions', [
            'id'             => $uuid,
            'amount'         => 10000,
            'currency'       => 'BRL',
            'account_id'     => $account->id,
            'fitid'          => 'fitid',
            'memo'           => 'Test transaction',
            'date_posted'    => today(),
            'account_number' => '123456',
        ]);

        $this->assertDatabaseHas('accounts', [
            'id'      => $account->id,
            'balance' => 15000,
        ]);
    }
}
