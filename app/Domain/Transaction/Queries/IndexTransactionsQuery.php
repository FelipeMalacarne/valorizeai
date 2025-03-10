<?php

declare(strict_types=1);

namespace App\Domain\Transaction\Queries;

use App\Domain\Transaction\Projections\Transaction;
use App\Support\CQRS\Query;
use App\Support\Data\OrderBy;
use Carbon\Carbon;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Spatie\LaravelData\Attributes\FromAuthenticatedUserProperty;
use Spatie\LaravelData\Data;

/**
 * @implements Query<LengthAwarePaginator<Transaction>>
 */
final class IndexTransactionsQuery extends Data implements Query
{
    public function __construct(
        #[FromAuthenticatedUserProperty(property: 'id')]
        public string $user_id,
        public ?string $search = null,
        public ?string $category_id = null,
        public ?string $account_id = null,
        public ?Carbon $start_date = null,
        public ?Carbon $end_date = null,
        public ?OrderBy $order_by = null,
        public int $page = 1,
        public int $perPage = 15,
    ) {}
}
