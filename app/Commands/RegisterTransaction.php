<?php

namespace App\Commands;

use App\Aggregates\TransactionAggregate;
use Spatie\EventSourcing\Commands\AggregateUuid;
use Spatie\EventSourcing\Commands\HandledBy;

#[HandledBy(TransactionAggregate::class)]
class RegisterTransaction
{
    public function __construct(
        #[AggregateUuid] public string $id,
        private int $amount,
        private string $currency,
        private string $accountId,
        private ?string $fitid = null,
        private ?string $memo = null,
        private ?string $accountNumber = null,
        private ?\DateTime $datePosted = null
    ) {
        $this->datePosted = $this->datePosted ?? new \DateTime;
    }

    public function amount(): int
    {
        return $this->amount;
    }

    public function currency(): string
    {
        return $this->currency;
    }

    public function accountId(): string
    {
        return $this->accountId;
    }

    public function fitid(): ?string
    {
        return $this->fitid;
    }

    public function memo(): ?string
    {
        return $this->memo;
    }

    public function accountNumber(): ?string
    {
        return $this->accountNumber;
    }

    public function datePosted(): \DateTime
    {
        return $this->datePosted;
    }
}
