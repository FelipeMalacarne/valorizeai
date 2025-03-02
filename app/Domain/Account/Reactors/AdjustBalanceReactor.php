<?php

declare(strict_types=1);

namespace App\Domain\Account\Reactors;

use App\Domain\Account\Commands\AdjustAccountBalance;
use App\Domain\Transaction\Events\AmountAmended as TransactionAmountAmended;
use App\Domain\Transaction\Events\Deleted as TransactionDeleted;
use App\Domain\Transaction\Events\Registered as TransactionRegistered;
use Spatie\EventSourcing\Commands\CommandBus;
use Spatie\EventSourcing\EventHandlers\Reactors\Reactor;

final class AdjustBalanceReactor extends Reactor
{
    public function __construct(
        private CommandBus $commandBus
    ) {}

    public function onTransactionRegistered(TransactionRegistered $event): void
    {
        $this->commandBus->dispatch(
            new AdjustAccountBalance(
                id: $event->accountId,
                amount: $event->amount,
            )
        );
    }

    public function onTransactionAmountAmended(TransactionAmountAmended $event): void
    {
        $this->commandBus->dispatch(
            new AdjustAccountBalance(
                id: $event->accountId,
                amount: $event->difference(),
            )
        );
    }

    public function onTransactionDeleted(TransactionDeleted $event): void
    {
        $this->commandBus->dispatch(
            new AdjustAccountBalance(
                id: $event->accountId,
                amount: -1 * $event->amount,
            )
        );
    }
}
