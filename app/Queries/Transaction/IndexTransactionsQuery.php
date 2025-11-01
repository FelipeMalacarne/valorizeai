<?php

declare(strict_types=1);

namespace App\Queries\Transaction;

use App\Enums\TransactionType;
use App\Http\Requests\Transaction\IndexTransactionRequest;
use App\Http\Resources\TransactionResource;
use App\Http\Resources\TransactionSummaryResource;
use App\Models\User;
use App\ValueObjects\Money;
use Illuminate\Contracts\Pagination\Paginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

final class IndexTransactionsQuery
{
    public function handle(IndexTransactionRequest $args, User $user): Paginator
    {
        /** @var Builder<\App\Models\Transaction> $query */
        $query = $user->transactions()
            ->with([
                'splits.category',
                'category',
                'account.bank',
            ]);

        $query = $this->applyFilters($args, $query);

        $query->orderBy(
            $args->order_by?->column ?? 'date',
            $args->order_by?->direction->value ?? 'desc',
        );

        return $query->paginate(perPage: $args->per_page, page: $args->page)->withQueryString();
    }

    /** @return Paginator<TransactionResource> */
    public function resource(IndexTransactionRequest $args, User $user): Paginator
    {
        return TransactionResource::collect($this->handle($args, $user));

    }

    public function summary(IndexTransactionRequest $args, User $user): TransactionSummaryResource
    {
        $query = $this->applyFilters($args, $user->transactions(), includeTypeFilter: false);

        $creditSum = (int) (clone $query)
            ->where('transactions.type', TransactionType::CREDIT)
            ->sum('transactions.amount');

        $debitSum = (int) (clone $query)
            ->where('transactions.type', TransactionType::DEBIT)
            ->sum('transactions.amount');

        $currency = $user->preferred_currency;

        return new TransactionSummaryResource(
            balance: new Money($creditSum + $debitSum, $currency),
            credits: new Money($creditSum, $currency),
            debits: new Money($debitSum, $currency),
        );
    }

    /**
     * @param  Builder<\App\Models\Transaction>|HasManyThrough  $query
     * @return Builder<\App\Models\Transaction>|HasManyThrough
     */
    private function applyFilters(IndexTransactionRequest $args, Builder|HasManyThrough $query, bool $includeTypeFilter = true): Builder|HasManyThrough
    {
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

        if ($includeTypeFilter && $args->type) {
            $query->where('transactions.type', $args->type);
        }

        if ($args->search) {
            $query->where('memo', 'like', "%$args->search%");
        }

        return $query;
    }
}
