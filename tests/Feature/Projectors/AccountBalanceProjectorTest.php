<?php

namespace Tests\Feature\Projectors;

use App\Enums\Color;
use App\Events\Account\Created as AccountCreated;
use App\Events\Account\Deleted as AccountDeleted;
use App\Events\Transaction\Deleted as TransactionDeleted;
use App\Events\Transaction\Registered as TransactionRegistered;
use App\Models\Account;
use App\Models\Transaction;
use App\Models\User;
use App\Projectors\AccountBalanceProjector;
use Spatie\EventSourcing\Commands\CommandBus;
use Tests\TestCase;

class AccountBalanceProjectorTest extends TestCase
{
    private AccountBalanceProjector $projector;

    public function setUp(): void
    {
        parent::setUp();
        $this->projector = app(AccountBalanceProjector::class);
    }

    public function test_it_creates_an_account_when_account_created_event_is_handled()
    {
        $user = User::factory()->create();

        $event = new AccountCreated(
            name: 'Test Account',
            color: Color::Teal,
            userId: $user->id,
        );

        $this->projector->onAccountCreated($event);

        $this->assertDatabaseHas('accounts', [
            'name'    => 'Test Account',
            'color'   => Color::Teal,
            'user_id' => $user->id,
        ]);
    }

    public function test_it_increments_balance_when_transaction_registered_event_is_handled()
    {
        $account = Account::factory()->create([
            'balance' => 1000,
        ]);

        $event = new TransactionRegistered(
            accountId: $account->id,
            currency: 'BRL',
            amount: 500,
        );

        $this->projector->onTransactionRegistered($event);

        $this->assertDatabaseHas('accounts', [
            'id'      => $account->id,
            'balance' => 1500,
        ]);
    }

    public function test_it_decrements_balance_when_transaction_deleted_event_is_handled()
    {
        $account = Account::factory()->create([
            'balance' => 1500,
        ]);

        $transaction = Transaction::factory()->create([
            'account_id' => $account->id,
            'amount'     => 500,
        ]);

        $event = new TransactionDeleted($transaction);

        $this->projector->onTransactionDeleted($event);

        $this->assertDatabaseHas('accounts', [
            'id'      => $account->id,
            'balance' => 1000,
        ]);
    }

    public function test_it_deletes_an_account_when_account_deleted_event_is_handled()
    {
        $account = Account::factory()->create();

        $event = new AccountDeleted(
            accountId: $account->id,
        );

        $this->projector->onAccountDeleted($event);

        $this->assertDatabaseMissing('accounts', [
            'id' => $account->id,
        ]);
    }
}
