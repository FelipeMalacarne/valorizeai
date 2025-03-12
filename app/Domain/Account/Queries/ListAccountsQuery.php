<?php

declare(strict_types=1);

namespace App\Domain\Account\Queries;

use App\Support\CQRS\CacheableQuery;
use Illuminate\Support\Carbon;
use Spatie\LaravelData\Attributes\FromAuthenticatedUserProperty;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\Optional as TypeScriptOptional;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
final class ListAccountsQuery extends Data implements CacheableQuery
{
    public function __construct(
        #[FromAuthenticatedUserProperty(property: 'id')]
        #[TypeScriptOptional]
        public string $userId,
    ) {}

    public function cacheKey(): string
    {
        return 'accounts.user.'.$this->userId;
    }

    public function ttl(): Carbon
    {
        return now()->addMinutes(30);
    }
}
