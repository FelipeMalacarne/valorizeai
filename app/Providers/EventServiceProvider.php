<?php

declare(strict_types=1);

namespace App\Providers;

use App\Events\Account\BulkTransactionsAdded;
use App\Events\Import\ImportCreated;
use App\Events\Transaction\TransactionCreated;
use App\Events\Transaction\TransactionDeleted;
use App\Events\Transaction\TransactionUpdated;
use App\Listeners\ProcessImportListener;
use App\Listeners\UpdateAccountBalanceListener;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;

class EventServiceProvider extends ServiceProvider
{
    /**
     * The event to listener mappings for the application.
     *
     * @var array<class-string, array<int, class-string>>
     */
    protected $listen = [
        TransactionCreated::class => [
            UpdateAccountBalanceListener::class,
        ],
        TransactionUpdated::class => [
            UpdateAccountBalanceListener::class,
        ],
        TransactionDeleted::class => [
            UpdateAccountBalanceListener::class,
        ],

        ImportCreated::class => [
            ProcessImportListener::class,
        ],
        BulkTransactionsAdded::class => [
            UpdateAccountBalanceListener::class,
        ],
    ];

    /**
     * Register any events for your application.
     */
    public function boot(): void
    {
        //
    }

    public function shouldDiscoverEvents(): bool
    {
        return false;
    }
}
