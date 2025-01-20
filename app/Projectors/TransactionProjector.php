<?php

namespace App\Projectors;

use App\Events\Transaction\Deleted;
use App\Events\Transaction\Registered;
use App\Models\Transaction;
use Spatie\EventSourcing\EventHandlers\Projectors\Projector;

class TransactionProjector extends Projector
{
    public function onTransactionRegistered(Registered $event)
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

    public function onTransactionDeleted(Deleted $event)
    {
        Transaction::find($event->aggregateRootUuid())
            ->writeable()
            ->delete();
    }
}
