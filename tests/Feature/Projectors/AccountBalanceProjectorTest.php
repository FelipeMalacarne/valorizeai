<?php

namespace Tests\Feature\Projectors;

use App\Domain\Account\Enums\Color;
use App\Domain\Account\Events\AccountCreated;
use App\Domain\Account\Events\AccountDeleted;
use App\Domain\Account\Projections\Account;
use App\Domain\Account\Projectors\AccountBalanceProjector;
use App\Domain\Transaction\Commands\AmendTransactionAmount;
use App\Domain\Transaction\Commands\RegisterTransaction;
use App\Models\User;
use Illuminate\Support\Str;
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
            color: Color::Teal->value,
            userId: $user->id,
        );

        $this->projector->onAccountCreated($event);

        $this->assertDatabaseHas('accounts', [
            'name'    => 'Test Account',
            'color'   => Color::Teal,
            'user_id' => $user->id,
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

    public function test_it_syncs_account_balance_when_transaction_is_amended(): void
    {
        $account = Account::factory()->create([
            'balance' => 5000,
        ]);

        $bus = app(CommandBus::class);
        $transaction_id = Str::uuid7();
        $bus->dispatch(new RegisterTransaction(
            id: $transaction_id,
            accountId: $account->id,
            amount: 5000,
            currency: 'BRL',
        ));

        $this->assertDatabaseHas('accounts', [
            'id'      => $account->id,
            'balance' => 10000,
        ]);

        $bus->dispatch(new AmendTransactionAmount(
            id: $transaction_id,
            amount: 500,
        ));

        $this->assertDatabaseHas('accounts', [
            'id'      => $account->id,
            'balance' => 5500,
        ]);
    }
}
