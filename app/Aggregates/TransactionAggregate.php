<?php

namespace App\Aggregates;

use App\Commands\AmendTransactionAmount;
use App\Commands\ChangeTransactionDescription;
use App\Commands\DeleteTransaction;
use App\Commands\RegisterTransaction;
use App\Events\Transaction\AmountAmended;
use App\Events\Transaction\Deleted;
use App\Events\Transaction\DescriptionChanged;
use App\Events\Transaction\Registered;
use App\Models\Transaction;
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
            description: $command->description(),
        ));

        return $this;
    }

    public function delete(DeleteTransaction $command): self
    {
        $transaction = Transaction::findOrFail($command->id);

        $this->recordThat(new Deleted(
            accountId: $transaction->account_id,
            amount: $transaction->amount,
        ));

        return $this;
    }

    public function amendAmount(AmendTransactionAmount $command): self
    {
        $transaction = Transaction::findOrFail($command->id);

        $this->recordThat(new AmountAmended(
            accountId: $transaction->account_id,
            amount: $command->amount,
            oldAmount: $transaction->amount,
        ));

        return $this;
    }

    public function descriptionChanged(ChangeTransactionDescription $command): self
    {
        $this->recordThat(new DescriptionChanged($command->description));

        return $this;
    }
}
