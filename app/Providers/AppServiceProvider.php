<?php

declare(strict_types=1);

namespace App\Providers;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

final class AppServiceProvider extends ServiceProvider
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

        $this->configureCommands();
        $this->configureModels();
        $this->configureResources();
        $this->configureVite();
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

    private function configureResources(): void
    {
        JsonResource::withoutWrapping();
    }

    private function configureVite(): void
    {
        Vite::usePrefetchStrategy('aggressive');
        Vite::prefetch(concurrency: 3);
    }
}
