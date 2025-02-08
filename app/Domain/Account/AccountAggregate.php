<?php

namespace App\Domain\Account;

use App\Domain\Account\Commands\AdjustAccountBalance;
use App\Domain\Account\Commands\CreateAccount;
use App\Domain\Account\Events\AccountCreated;
use App\Domain\Account\Events\BalanceAdjusted;
use Spatie\EventSourcing\AggregateRoots\AggregateRoot;

class AccountAggregate extends AggregateRoot
{
    private int $balance = 0;

    public function adjustBalance(AdjustAccountBalance $command): self
    {
        //TODO: Add validation (e.g., currency check, overdraft protection)
        $this->recordThat(new BalanceAdjusted($command->amount));

        return $this;
    }

    public function applyBalanceAdjusted(BalanceAdjusted $event): void
    {
        $this->balance += $event->amount;
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

    //
    // public function updateAccount(UpdateAccount $command): self
    // {
    //     $this->recordThat(new Updated(
    //         name: $command->name,
    //         type: $command->type,
    //         color: $command->color,
    //         description: $command->description
    //     ));
    //
    //     return $this;
    // }
    //
    // public function deleteAccount(DeleteAccount $command): self
    // {
    //     $this->recordThat(new Deleted());
    //
    //     return $this;
    // }

}
