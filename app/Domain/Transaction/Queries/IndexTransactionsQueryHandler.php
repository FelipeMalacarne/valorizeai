<?php

declare(strict_types=1);

namespace App\Domain\Transaction\Queries;

use App\Domain\Transaction\Projections\Transaction;
use App\Support\CQRS\QueryHandler;
use App\Support\Explorer\Enums\MultiMatchType;
use App\Support\Explorer\Syntax\MultiMatch;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use JeroenG\Explorer\Infrastructure\Scout\Builder;

/**
 * @implements QueryHandler<LengthAwarePaginator<Transaction>, IndexTransactionsQuery>
 */
final class IndexTransactionsQueryHandler implements QueryHandler
{
    /**
     * @return LengthAwarePaginator<Transaction>
     */
    public function handle(IndexTransactionsQuery $query): LengthAwarePaginator
    {
        /* @var Builder $builder */
        $builder = Transaction::search()
            ->where('user_id', $query->user_id);

        if ($query->search) {
            $builder->must(new MultiMatch(
                value: $query->search,
                fields: [
                    'description',
                    'description._2gram',
                    'description._3gram',
                    'memo',
                    'memo._2gram',
                    'memo._3gram',
                ],
                type: MultiMatchType::BOOL_PREFIX,
            ));
        }

        if ($query->accounts) {
            $builder->whereIn('account_id', $query->accounts);
        }

        if ($query->categories) {
            $builder->whereIn('categories', $query->categories);
        }

        $transactions = $builder
            ->orderBy(
                column: $query->order_by?->column ?? 'created_at',
                direction: $query->order_by?->direction ?? 'desc'
            )
            ->paginate(
                perPage: $query->per_page,
                pageName: 'page',
                page: $query->page
            )
            ->withQueryString();

        $transactions->load(['categories', 'account']);

        return $transactions;

    }
}
