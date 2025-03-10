<?php

declare(strict_types=1);

namespace App\Domain\Transaction\Queries;

use App\Domain\Transaction\Projections\Transaction;
use App\Support\CQRS\QueryHandler;
use App\Support\Explorer\Enums\MultiMatchType;
use App\Support\Explorer\Syntax\MultiMatch;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Auth;

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
        $accounts = Auth::user()->accounts()->pluck('id')->toArray();

        $builder = Transaction::search();
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

        $transactions = $builder->whereIn('account_id', $accounts)
            ->orderByDesc('created_at')
            ->paginate($query->perPage)
            ->withQueryString();

        $transactions->load(['categories', 'account']);

        return $transactions;

    }
}
