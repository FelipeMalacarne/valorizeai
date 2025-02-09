<?php

namespace App\Providers;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        if (config('app.debug')) {
            DB::listen(function ($query) {
                Log::info('SQL', [
                    'query'    => $query->sql,
                    'bindings' => $query->bindings,
                    'time'     => $query->time,
                ]);
            });
        }

        Vite::prefetch(concurrency: 3);
        JsonResource::withoutWrapping();
    }
}
