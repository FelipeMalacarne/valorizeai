<?php

namespace App\Domain\Account\Projectors;

use App\Domain\Account\Events\AccountCreated;
use App\Domain\Account\Events\AccountDeleted;
use App\Domain\Account\Events\AccountDetailsUpdated;
use App\Domain\Account\Events\BalanceAdjusted;
use App\Domain\Account\Projections\Account;
use Spatie\EventSourcing\EventHandlers\Projectors\Projector;

class AccountBalanceProjector extends Projector
{
    public function onAccountCreated(AccountCreated $event): void
    {
        Account::new()
            ->writeable()
            ->create([
                'id'          => $event->aggregateRootUuid(),
                'name'        => $event->name,
                'number'      => $event->number,
                'color'       => $event->color,
                'type'        => $event->type,
                'bank_code'   => $event->bankCode,
                'description' => $event->description,
                'user_id'     => $event->userId,
            ]);
    }

    public function onAccountDeleted(AccountDeleted $event): void
    {
        Account::findOrFail($event->accountId)
            ->writeable()
            ->delete();
    }

    public function onAccountBalanceAdjusted(BalanceAdjusted $event): void
    {
        Account::findOrFail($event->aggregateRootUuid())
            ->writeable()
            ->increment('balance', $event->amount);
    }

    public function onAccountDetailsUpdated(AccountDetailsUpdated $event): void
    {
        Account::findOrFail($event->accountId)
            ->writeable()
            ->update([
                'name'        => $event->name,
                'number'      => $event->number,
                'color'       => $event->color,
                'type'        => $event->type,
                'bank_code'   => $event->bankCode,
                'description' => $event->description,
            ]);
    }
}
