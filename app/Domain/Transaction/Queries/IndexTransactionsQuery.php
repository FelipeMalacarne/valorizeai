<?php

declare(strict_types=1);

namespace App\Domain\Transaction\Queries;

use App\Domain\Transaction\Projections\Transaction;
use App\Support\CQRS\Query;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Spatie\LaravelData\Data;

/**
 * @implements Query<LengthAwarePaginator<Transaction>>
 */
final class IndexTransactionsQuery extends Data implements Query
{
    public function __construct(
        public ?string $search = null,
        public int $page = 1,
        public int $perPage = 15,
    ) {}
}
