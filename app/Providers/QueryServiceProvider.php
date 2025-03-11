<?php

declare(strict_types=1);

namespace App\Providers;

use App\Support\CQRS\CachingQueryBus;
use App\Support\CQRS\QueryBus;
use App\Support\CQRS\QueryBusContract;
use App\Support\CQRS\QueryHandler;
use Illuminate\Support\ServiceProvider;
use ReflectionClass;

final class QueryServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        $handlers = [
            \App\Domain\Transaction\Queries\IndexTransactionsQueryHandler::class,
            \App\Domain\Category\Queries\ListCategoriesQueryHandler::class,
            \App\Domain\Account\Queries\ListAccountsQueryHandler::class,
        ];

        // [ QueryFQN => HandlerFQN ]
        $queryMap = [];

        foreach ($handlers as $handlerClass) {
            $this->app->bind($handlerClass);

            $reflection = new ReflectionClass($handlerClass);

            if (! $reflection->implementsInterface(QueryHandler::class)) {
                continue;
            }

            if (! $reflection->hasMethod('handle')) {
                continue;
            }

            $method = $reflection->getMethod('handle');
            $params = $method->getParameters();

            if (count($params) !== 1) {
                continue;
            }

            $paramType = $params[0]->getType();

            if ($paramType && ! $paramType->isBuiltin()) {
                // E.g. "App\Domain\Transaction\Queries\GetTransactionsQuery"
                $queryClass = $paramType->getName();
                // e) Save in the map
                $queryMap[$queryClass] = $handlerClass;
            }
        }

        // 3) Put that map into the container so we can retrieve it later
        $this->app->singleton('query.handlers.map', fn () => $queryMap);

        $this->app->singleton(QueryBusContract::class, function ($app) {
            $handlerMap = $app->make('query.handlers.map');

            $baseBus = new QueryBus(
                container: $app,
                handlerMap: $handlerMap
            );

            return new CachingQueryBus($baseBus);

            // return $baseBus;
        });
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
