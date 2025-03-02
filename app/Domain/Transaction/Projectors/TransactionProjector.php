<?php

declare(strict_types=1);

namespace App\Domain\Transaction\Projectors;

use App\Domain\Transaction\Events\AmountAmended;
use App\Domain\Transaction\Events\Deleted;
use App\Domain\Transaction\Events\DescriptionChanged;
use App\Domain\Transaction\Events\Registered;
use App\Domain\Transaction\Projections\Transaction;
use Spatie\EventSourcing\EventHandlers\Projectors\Projector;

final class TransactionProjector extends Projector
{
    public function onTransactionRegistered(Registered $event): void
    {
        Transaction::new()
            ->writeable()
            ->create([
                'id'             => $event->aggregateRootUuid(),
                'amount'         => $event->amount,
                'currency'       => $event->currency,
                'date_posted'    => $event->datePosted,
                'fitid'          => $event->fitid,
                'memo'           => $event->memo,
                'account_number' => $event->accountNumber,
                'description'    => $event->description,
                'account_id'     => $event->accountId,
            ]);
    }

    public function onTransactionDeleted(Deleted $event): void
    {
        Transaction::findOrFail($event->aggregateRootUuid())
            ->writeable()
            ->delete();
    }

    public function onAmountAmended(AmountAmended $event): void
    {
        $transaction = Transaction::find($event->aggregateRootUuid());

        $transaction->amount = $event->amount;

        $transaction->writeable()->save();
    }

    public function onDescriptionChanged(DescriptionChanged $event): void
    {
        $transaction = Transaction::find($event->aggregateRootUuid());

        $transaction->description = $event->description;

        $transaction->writeable()->save();
    }
}
