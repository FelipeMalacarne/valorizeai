<?php

declare(strict_types=1);

namespace App\Support\CQRS;

use Illuminate\Support\Facades\Cache;

final class CachingQueryBus implements QueryBusContract
{
    public function __construct(
        protected QueryBusContract $decoratee
    ) {}

    public function dispatch(object $query): mixed
    {
        // For demonstration, let's do a simple approach:
        // If the query implements "CacheableQueryContract",
        // we use its TTL and a hashed key. Otherwise, pass through.
        if (! $query instanceof CacheableQuery) {
            return $this->decoratee->dispatch($query);
        }

        $cacheKey = $query->cacheKey();
        $ttl = $query->ttl();

        return Cache::remember($cacheKey, $ttl, function () use ($query) {
            return $this->decoratee->dispatch($query);
        });
    }
}
