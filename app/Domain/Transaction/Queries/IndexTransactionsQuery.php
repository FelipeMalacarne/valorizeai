<?php

declare(strict_types=1);

namespace App\Domain\Transaction\Queries;

use App\Domain\Transaction\Projections\Transaction;
use App\Support\CQRS\Query;
use App\Support\Data\OrderBy;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Carbon;
use Spatie\LaravelData\Attributes\FromAuthenticatedUserProperty;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Casts\DateTimeInterfaceCast;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Transformers\DateTimeInterfaceTransformer;
use Spatie\TypeScriptTransformer\Attributes\Optional as TypeScriptOptional;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * @implements Query<LengthAwarePaginator<Transaction>>
 */
#[TypeScript]
final class IndexTransactionsQuery extends Data implements Query
{
    public function __construct(
        #[FromAuthenticatedUserProperty(property: 'id')]
        #[TypeScriptOptional]
        public string $user_id,
        public ?string $search = null,
        /** @var string[] */
        public array $categories = [],
        /** @var string[] */
        public array $accounts = [],
        // 2025-03-03T03:00:00.000Z
        #[WithCast(DateTimeInterfaceCast::class, format: 'Y-m-d\TH:i:s.uP')]
        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'Y-m-d\TH:i:s.uP')]
        public ?Carbon $start_date = null,
        #[WithCast(DateTimeInterfaceCast::class, format: 'Y-m-d\TH:i:s.uP')]
        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'Y-m-d\TH:i:s.uP')]
        public ?Carbon $end_date = null,
        public ?OrderBy $order_by = null,
        public int $page = 1,
        public int $per_page = 15,
    ) {}
}
