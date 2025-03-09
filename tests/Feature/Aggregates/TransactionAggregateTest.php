<?php

declare(strict_types=1);

namespace Tests\Feature\Aggregates;

use App\Domain\Account\Projections\Account;
use App\Domain\Transaction\Commands\AmendTransactionAmount;
use App\Domain\Transaction\Commands\DeleteTransaction;
use App\Domain\Transaction\Commands\RegisterTransaction;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Spatie\EventSourcing\Commands\CommandBus;
use Tests\TestCase;

final class TransactionAggregateTest extends TestCase
{
    // use RefreshDatabase;

    /**
     * A basic feature test example.
     */
    public function test_register(): void
    {
        $uuid = Str::uuid7()->toString();

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
        $uuid = Str::uuid7()->toString();
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
        $uuid = Str::uuid7()->toString();
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
        $uuid = Str::uuid7()->toString();
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

    public function test_account_after_register_transaction(): void
    {
        $uuid = Str::uuid7()->toString();
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

        $this->assertDatabaseHas('accounts', [
            'id'      => $account->id,
            'balance' => 10000,
        ]);
    }

    public function test_account_balance_after_delete_transaction(): void
    {
        $uuid = Str::uuid7()->toString();
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

        $this->assertDatabaseHas('accounts', [
            'id'      => $account->id,
            'balance' => 10000,
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

        $this->assertDatabaseHas('accounts', [
            'id'      => $account->id,
            'balance' => 5000,
        ]);
    }
}
