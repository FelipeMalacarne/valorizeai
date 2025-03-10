<?php

declare(strict_types=1);

namespace App\Domain\Transaction\Queries;

use App\Domain\Transaction\Projections\Transaction;
use App\Support\CQRS\QueryHandler;
use App\Support\Explorer\Enums\MultiMatchType;
use App\Support\Explorer\Syntax\MultiMatch;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Auth;
use JeroenG\Explorer\Domain\Syntax\Term;

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

        if ($query->account_id) {
            $builder->must(new Term('account_id', $query->account_id));
        }

        if ($query->category_id) {
            $builder->must(new Term('categories', $query->category_id));
        }

        $transactions = $builder
            ->orderBy(
                column: $query->order_by?->column ?? 'created_at',
                direction: $query->order_by?->direction ?? 'desc'
            )
            ->paginate(
                perPage: $query->perPage,
                pageName: 'page',
                page: $query->page
            )
            ->withQueryString();

        $transactions->load(['categories', 'account']);

        return $transactions;

    }
}
