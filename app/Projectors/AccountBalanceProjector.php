<?php

namespace App\Projectors;

use App\Events\Account\Created;
use App\Events\Account\Deleted;
use App\Events\Account\MoneyAdded;
use App\Events\Account\MoneySubtracted;
use App\Models\Account;
use Spatie\EventSourcing\EventHandlers\Projectors\Projector;

class AccountBalanceProjector extends Projector
{
    public function onAccountCreated(Created $event)
    {
        Account::new()
            ->writeable()
            ->create($event->accountAttributes);
    }

    public function onMoneyAdded(MoneyAdded $event)
    {
        $account = Account::find($event->accountId);

        $account->balance += $event->amount;

        $account->writeable()->save();
    }

    public function onMoneySubtracted(MoneySubtracted $event)
    {
        $account = Account::find($event->accountId);

        $account->balance -= $event->amount;

        $account->writeable()->save();
    }

    public function onAccountDeleted(Deleted $event)
    {
        Account::find($event->accountId)->writeable()->delete();
    }
}
