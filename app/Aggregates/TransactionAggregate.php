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
use Spatie\EventSourcing\AggregateRoots\AggregateRoot;

class TransactionAggregate extends AggregateRoot
{
    private int $amount;

    private string $currency;

    private string $accountId;

    private ?string $description = null;

    public function applyRegistered(Registered $event): void
    {
        $this->amount = $event->amount;
        $this->currency = $event->currency;
        $this->accountId = $event->accountId;
        $this->description = $event->description;
    }

    public function applyAmountAmended(AmountAmended $event): void
    {
        $this->amount = $event->amount;
    }

    public function applyDescriptionChanged(DescriptionChanged $event): void
    {
        $this->description = $event->description;
    }

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
        $this->recordThat(new Deleted(
            accountId: $this->accountId,
            amount: $this->amount,
        ));

        return $this;
    }

    public function amendAmount(AmendTransactionAmount $command): self
    {
        $this->recordThat(new AmountAmended(
            accountId: $this->accountId,
            amount: $command->amount,
            oldAmount: $this->amount,
        ));

        return $this;
    }

    public function descriptionChanged(ChangeTransactionDescription $command): self
    {
        $this->recordThat(new DescriptionChanged($command->description));

        return $this;
    }
}
