<?php

declare(strict_types=1);

namespace App\Domain\Category\Queries;

use App\Support\CQRS\CacheableQuery;
use Carbon\Carbon;
use Spatie\LaravelData\Attributes\FromAuthenticatedUserProperty;
use Spatie\LaravelData\Data;

final class ListCategoriesQuery extends Data implements CacheableQuery
{
    public function __construct(
        #[FromAuthenticatedUserProperty(property: 'id')]
        public string $user_id,
    ) {}

    public function cacheKey(): string
    {
        return 'categories.user.'.$this->user_id;
    }

    public function ttl(): Carbon
    {
        return now()->addDay();
    }
}
