<?php

namespace App\Support\CQRS;

use Carbon\Carbon;

interface CacheableQuery
{
    /**
     * How long in seconds should the result be cached?
     */
    public function ttl(): Carbon;

    public function cacheKey(): string;
}
