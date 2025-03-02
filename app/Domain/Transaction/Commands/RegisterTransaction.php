<?php

declare(strict_types=1);

namespace App\Domain\Transaction\Commands;

use App\Domain\Transaction\TransactionAggregate;
use DateTimeImmutable;
use Spatie\EventSourcing\Commands\AggregateUuid;
use Spatie\EventSourcing\Commands\HandledBy;

#[HandledBy(TransactionAggregate::class)]
final class RegisterTransaction
{
    public function __construct(
        #[AggregateUuid] public string $id,
        private int $amount,
        private string $currency,
        private string $accountId,
        private ?string $fitid = null,
        private ?string $memo = null,
        private ?string $accountNumber = null,
        private ?DateTimeImmutable $datePosted = null,
        private ?string $description = null,
    ) {
        $this->datePosted = $this->datePosted ?? new DateTimeImmutable;
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

    public function datePosted(): DateTimeImmutable
    {
        return $this->datePosted;
    }

    public function description(): ?string
    {
        return $this->description;
    }
}
