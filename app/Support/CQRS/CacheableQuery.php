<?php

namespace App\Support\CQRS;

interface CacheableQuery
{
    /**
     * How long in seconds should the result be cached?
     */
    public function ttl(): int;

    public function cacheKey(): string;
}
