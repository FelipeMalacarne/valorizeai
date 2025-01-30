<?php

namespace Tests\Feature\Aggregates;

use App\Domain\Account\Commands\AdjustAccountBalance;
use App\Domain\Account\Commands\CreateAccount;
use App\Domain\Account\Enums\Color;
use App\Models\User;
use Illuminate\Support\Str;
use Spatie\EventSourcing\Commands\CommandBus;
use Tests\TestCase;

class AccountAggregateTest extends TestCase
{
    public function test_create_account(): void
    {
        $uuid = Str::uuid7();
        $bus = app(CommandBus::class);

        $user = User::factory()->create();

        $bus->dispatch(new CreateAccount(
            id: $uuid,
            name: 'Test Account',
            color: Color::Lavender,
            userId: $user->id,
        ));

        $this->assertDatabaseHas('accounts', [
            'id'      => $uuid,
            'name'    => 'Test Account',
            'color'   => Color::Lavender,
            'user_id' => $user->id,
        ]);
    }

    public function test_adjust_balance(): void
    {
        $uuid = Str::uuid7();
        $bus = app(CommandBus::class);
        $user = User::factory()->create();

        $bus->dispatch(new CreateAccount(
            id: $uuid,
            name: 'Test Account',
            color: Color::Lavender,
            userId: $user->id,
        ));

        $this->assertDatabaseHas('accounts', [
            'id'      => $uuid,
            'balance' => 0,
        ]);

        $bus->dispatch(new AdjustAccountBalance(
            id: $uuid,
            amount: 5000,
        ));

        $this->assertDatabaseHas('accounts', [
            'id'      => $uuid,
            'balance' => 5000,
        ]);
    }
}
