<?php

declare(strict_types=1);

namespace App\Support\CQRS;

use Illuminate\Contracts\Container\Container;
use RuntimeException;

/**
 * @template T
 * @template Q of Query<T>
 */
final class QueryBus implements QueryBusContract
{
    /**
     * @param  array<string, string>  $handlerMap  [QueryClass => HandlerClass]
     */
    public function __construct(
        protected Container $container,
        protected array $handlerMap = []
    ) {}

    public function dispatch(object $query): mixed
    {
        $queryClass = get_class($query);

        $handlerClass = $this->handlerMap[$queryClass] ?? null;

        if (! $handlerClass) {
            throw new RuntimeException("No handler registered for [{$queryClass}].");
        }

        $handler = $this->container->make($handlerClass);

        return $handler->handle($query);
    }
}
