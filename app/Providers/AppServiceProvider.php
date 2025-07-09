<?php

declare(strict_types=1);

namespace App\Providers;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

final class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        // ...
    }

    public function boot(): void
    {
        // if (config('app.debug')) {
        //     DB::listen(function ($query) {
        //         Log::info('SQL', [
        //             'query'    => $query->sql,
        //             'bindings' => $query->bindings,
        //             'time'     => $query->time,
        //         ]);
        //     });
        // }

        $this->configureCommands();
        $this->configureModels();
        $this->configureVite();
        // $this->configureSanctum();
        // $this->configureCashier();
    }

    private function configureCommands(): void
    {
        DB::prohibitDestructiveCommands(
            $this->app->isProduction(),
        );
    }

    private function configureModels(): void
    {
        Model::shouldBeStrict();
        Model::unguard();
    }

    private function configureVite(): void
    {
        Vite::usePrefetchStrategy('aggressive');
        Vite::prefetch(concurrency: 3);
    }

    // private function configureSanctum(): void
    // {
    //     Sanctum::usePersonalAccessTokenModel(PersonalAccessToken::class);
    // }
    //
    // private function configureCashier(): void
    // {
    //     Cashier::useCustomerModel(Organization::class);
    //     Cashier::useSubscriptionModel(Subscription::class);
    // }
}
