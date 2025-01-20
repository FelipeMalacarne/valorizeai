<?php

namespace App\Aggregates;

use App\Commands\RegisterTransaction;
use App\Events\Transaction\Deleted;
use App\Events\Transaction\Registered;
use Spatie\EventSourcing\AggregateRoots\AggregateRoot;

class TransactionAggregate extends AggregateRoot
{
    public function register(RegisterTransaction $command): self
    {
        $this->recordThat(new Registered(
            amount: $command->amount(),
            currency: $command->currency(),
            datePosted: $command->datePosted(),
            fitid: $command->fitid(),
            memo: $command->memo(),
            accountNumber: $command->accountNumber(),
            accountId: $command->accountId(),
        ));

        return $this;
    }

    public function deleteTransaction(string $transaction_id): self
    {
        $this->recordThat(Deleted::dispatch($transaction_id));

        return $this;
    }
}
