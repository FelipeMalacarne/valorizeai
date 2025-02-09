<?php

namespace App\Domain\Account;

use App\Domain\Account\Commands\AdjustAccountBalance;
use App\Domain\Account\Commands\CreateAccount;
use App\Domain\Account\Commands\DeleteAccount;
use App\Domain\Account\Commands\UpdateAccountDetails;
use App\Domain\Account\Events\AccountCreated;
use App\Domain\Account\Events\AccountDeleted;
use App\Domain\Account\Events\AccountDetailsUpdated;
use App\Domain\Account\Events\BalanceAdjusted;
use Spatie\EventSourcing\AggregateRoots\AggregateRoot;

class AccountAggregate extends AggregateRoot
{
    private int $balance = 0;

    private string $name;

    private ?string $number = null;

    private string $color;

    private ?string $description = null;

    private string $userId;

    private string $type;

    private ?string $bankCode = null;

    public function adjustBalance(AdjustAccountBalance $command): self
    {
        $this->recordThat(new BalanceAdjusted($command->amount));

        return $this;
    }

    public function createAccount(CreateAccount $command): self
    {
        $this->recordThat(new AccountCreated(
            name: $command->name,
            number: $command->number,
            color: $command->color->value,
            description: $command->description,
            userId: $command->userId,
            type: $command->type->value,
            bankCode: $command->bankCode
        ));

        return $this;
    }

    public function updateAccountDetails(UpdateAccountDetails $command): self
    {
        $this->recordThat(new AccountDetailsUpdated(
            accountId: $command->accountId,
            commanderId: $command->commanderId,
            name: $command->name,
            color: $command->color?->value,
            type: $command->type?->value,
            number: $command->number,
            description: $command->description,
            bankCode: $command->bankCode,
        ));

        return $this;
    }

    public function deleteAccount(DeleteAccount $command): self
    {
        $this->recordThat(new AccountDeleted(
            accountId: $command->accountId,
            commanderId: $command->commanderId,
        ));

        return $this;
    }

    public function applyBalanceAdjusted(BalanceAdjusted $event): void
    {
        $this->balance += $event->amount;
    }

    public function applyAccountCreated(AccountCreated $event): void
    {
        $this->name = $event->name;
        $this->number = $event->number;
        $this->color = $event->color;
        $this->description = $event->description;
        $this->userId = $event->userId;
        $this->type = $event->type;
        $this->bankCode = $event->bankCode;
    }
}
