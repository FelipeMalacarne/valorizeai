<?php

namespace App\Projectors;

use App\Events\Account\Created as AccountCreated;
use App\Events\Account\Deleted;
use App\Events\Transaction\AmountAmended as TransactionAmountAmended;
use App\Events\Transaction\Deleted as TransactionDeleted;
use App\Events\Transaction\Registered as TransactionRegistered;
use App\Models\Account;
use App\Models\Transaction;
use Spatie\EventSourcing\EventHandlers\Projectors\Projector;

class AccountBalanceProjector extends Projector
{
    public function onAccountCreated(AccountCreated $event)
    {
        Account::new()
            ->writeable()
            ->create([
                'id'          => $event->aggregateRootUuid(),
                'name'        => $event->name,
                'type'        => $event->type,
                'number'      => $event->number,
                'color'       => $event->color,
                'description' => $event->description,
                'user_id'     => $event->userId,
            ]);
    }

    public function onTransactionRegistered(TransactionRegistered $event)
    {
        $account = Account::find($event->accountId);

        $account->balance += $event->amount;

        $account->writeable()->save();
    }

    public function onTransactionDeleted(TransactionDeleted $event)
    {
        Account::findOrFail($event->accountId)
            ->writeable()
            ->decrement('balance', $event->amount);
    }

    public function onAccountDeleted(Deleted $event)
    {
        Account::findOrFail($event->accountId)
            ->writeable()
            ->delete();
    }

    public function onTransactionAmountAmended(TransactionAmountAmended $event): void
    {
        Account::findOrFail($event->accountId)
            ->writeable()
            ->increment('balance', $event->difference());
    }
}
