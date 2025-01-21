<?php

namespace App\Projectors;

use App\Events\Transaction\AmountAmended;
use App\Events\Transaction\Deleted;
use App\Events\Transaction\DescriptionChanged;
use App\Events\Transaction\Registered;
use App\Models\Transaction;
use Spatie\EventSourcing\EventHandlers\Projectors\Projector;

class TransactionProjector extends Projector
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
