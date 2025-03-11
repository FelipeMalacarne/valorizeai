<?php

declare(strict_types=1);

namespace App\Domain\Account\Queries;

use App\Support\CQRS\Query;
use Spatie\LaravelData\Attributes\FromAuthenticatedUserProperty;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\Optional as TypeScriptOptional;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
final class ListAccountsQuery extends Data implements Query
{
    public function __construct(
        #[FromAuthenticatedUserProperty(property: 'id')]
        #[TypeScriptOptional]
        public string $userId,
    ) {}
}
