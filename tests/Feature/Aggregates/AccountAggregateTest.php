<?php

declare(strict_types=1);

namespace Tests\Feature\Aggregates;

use App\Domain\Account\Commands\AdjustAccountBalance;
use App\Domain\Account\Commands\CreateAccount;
use App\Domain\Account\Commands\DeleteAccount;
use App\Domain\Account\Commands\UpdateAccountDetails;
use App\Domain\Account\Enums\Color;
use App\Domain\Account\Enums\Type;
use App\Models\User;
use Illuminate\Support\Str;
use Spatie\EventSourcing\Commands\CommandBus;
use Tests\TestCase;

final class AccountAggregateTest extends TestCase
{
    public function test_create_account(): void
    {
        $uuid = Str::uuid7()->toString();
        $bus = app(CommandBus::class);

        $user = User::factory()->create();

        $bus->dispatch(new CreateAccount(
            id: $uuid,
            name: 'Test Account',
            color: Color::Lavender,
            type: Type::CHECKING,
            user_id: $user->id,
            bank_code: '001',
            description: 'Test Description',
            number: null,
        ));

        $this->assertDatabaseHas('accounts', [
            'id'          => $uuid,
            'name'        => 'Test Account',
            'color'       => Color::Lavender,
            'type'        => Type::CHECKING,
            'user_id'     => $user->id,
            'bank_code'   => '001',
            'description' => 'Test Description',
        ]);
    }

    public function test_adjust_balance(): void
    {
        $uuid = Str::uuid7()->toString();
        $bus = app(CommandBus::class);
        $user = User::factory()->create();

        $bus->dispatch(new CreateAccount(
            id: $uuid,
            name: 'Test Account',
            color: Color::Lavender,
            type: Type::CHECKING,
            user_id: $user->id,
            bank_code: '001',
            description: 'Test Description',
            number: null,
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

    public function test_update_account_details(): void
    {
        $uuid = Str::uuid7()->toString();
        $bus = app(CommandBus::class);
        $user = User::factory()->create();

        $bus->dispatch(new CreateAccount(
            id: $uuid,
            name: 'Test Account',
            color: Color::Lavender,
            type: Type::CHECKING,
            user_id: $user->id,
            bank_code: '001',
            description: 'Test Description',
            number: null,
        ));

        $this->assertDatabaseHas('accounts', [
            'id'          => $uuid,
            'name'        => 'Test Account',
            'color'       => Color::Lavender,
            'type'        => Type::CHECKING,
            'user_id'     => $user->id,
            'bank_code'   => '001',
            'description' => 'Test Description',
        ]);

        $bus->dispatch(new UpdateAccountDetails(
            accountId: $uuid,
            commanderId: $user->id,
            name: 'Updated Account',
            color: Color::Teal,
            type: Type::SAVINGS,
            bankCode: '002',
            description: 'Updated Description',
        ));

        $this->assertDatabaseHas('accounts', [
            'id'          => $uuid,
            'name'        => 'Updated Account',
            'color'       => Color::Teal,
            'type'        => Type::SAVINGS,
            'user_id'     => $user->id,
            'bank_code'   => '002',
            'description' => 'Updated Description',
        ]);
    }

    public function test_delete_account(): void
    {
        $uuid = Str::uuid7()->toString();
        $bus = app(CommandBus::class);
        $user = User::factory()->create();

        $bus->dispatch(new CreateAccount(
            id: $uuid,
            name: 'Test Account',
            color: Color::Lavender,
            type: Type::CHECKING,
            user_id: $user->id,
            bank_code: '001',
            description: 'Test Description',
            number: null,
        ));

        $this->assertDatabaseHas('accounts', [
            'id' => $uuid,
        ]);

        $bus->dispatch(new DeleteAccount(
            accountId: $uuid,
            commanderId: $user->id,
        ));

        $this->assertDatabaseMissing('accounts', [
            'id' => $uuid,
        ]);
    }
}
