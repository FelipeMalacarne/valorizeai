<?php

namespace App\Domain\Account;

use Spatie\EventSourcing\AggregateRoots\AggregateRoot;

class AccountAggregate extends AggregateRoot
{
    // public function createAccount(CreateAccount $command): self
    // {
    //     $this->recordThat(new Created(
    //         name: $command->name,
    //         type: $command->type,
    //         number: $command->number,
    //         color: $command->color,
    //         description: $command->description,
    //         userId: $command->userId
    //     ));
    //
    //     return $this;
    // }
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
