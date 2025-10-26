<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Actions\Account\UpdateAccountBalance;
use App\Events\Contracts\ShouldUpdateAccountBalance;
use Illuminate\Queue\InteractsWithQueue;

final class UpdateAccountBalanceListener
{
    use InteractsWithQueue;

    public function __construct(
        private readonly UpdateAccountBalance $action
    ) {}

    public function handle(ShouldUpdateAccountBalance $event): void
    {
        $this->action->handle(
            $event->accountId(),
            $event->amount()
        );
    }
}
