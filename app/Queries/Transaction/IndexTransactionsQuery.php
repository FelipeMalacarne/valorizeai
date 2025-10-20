<?php

declare(strict_types=1);

namespace App\Queries\Transaction;

use App\Http\Requests\Transaction\IndexTransactionRequest;
use App\Http\Resources\TransactionResource;
use App\Models\User;
use Illuminate\Contracts\Pagination\Paginator;

final class IndexTransactionsQuery
{
    public function handle(IndexTransactionRequest $args, User $user): Paginator
    {
        /** @var \Illuminate\Database\Eloquent\Builder<\App\Models\Transaction> $query */
        $query = $user->transactions()
            ->with([
                'splits.category',
                'category',
                'account.bank',
            ])
            ->latest();

        if ($args->accounts) {
            $query->whereIn('account_id', $args->accounts);
        }

        if ($args->categories) {
            $query->whereIn('category_id', $args->categories);
        }

        if ($args->start_date) {
            $query->whereDate('date', '>=', $args->start_date);
        }

        if ($args->end_date) {
            $query->whereDate('date', '<=', $args->end_date);
        }

        if ($args->type) {
            $query->where('transactions.type', $args->type);
        }

        if ($args->search) {
            $query->where('memo', 'like', "%$args->search%");
        }

        return $query->paginate(perPage: $args->per_page, page: $args->page)->withQueryString();
    }

    /** @return Paginator<TransactionResource> */
    public function resource(IndexTransactionRequest $args, User $user): Paginator
    {
        return TransactionResource::collect($this->handle($args, $user));

    }
}
