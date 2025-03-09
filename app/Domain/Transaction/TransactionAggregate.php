<?php

declare(strict_types=1);

namespace App\Domain\Transaction;

use App\Domain\Transaction\Commands\AmendTransactionAmount;
use App\Domain\Transaction\Commands\ChangeTransactionDescription;
use App\Domain\Transaction\Commands\DeleteTransaction;
use App\Domain\Transaction\Commands\RegisterTransaction;
use App\Domain\Transaction\Events\AmountAmended;
use App\Domain\Transaction\Events\Deleted;
use App\Domain\Transaction\Events\DescriptionChanged;
use App\Domain\Transaction\Events\Registered;
use Spatie\EventSourcing\AggregateRoots\AggregateRoot;

final class TransactionAggregate extends AggregateRoot
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
            amount: $command->amount,
            currency: $command->currency,
            datePosted: $command->datePosted,
            fitid: $command->fitid,
            memo: $command->memo,
            accountNumber: $command->accountNumber,
            accountId: $command->accountId,
            description: $command->description,
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
