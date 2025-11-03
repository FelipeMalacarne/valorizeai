<?php

declare(strict_types=1);

namespace App\Queries\Category;

use App\Enums\TransactionType;
use App\Http\Resources\CategoryAccountBreakdownResource;
use App\Http\Resources\CategoryInsightsResource;
use App\Http\Resources\CategoryMonthlyTotalResource;
use App\Models\Category;
use App\Models\User;
use App\ValueObjects\Money;
use Carbon\CarbonImmutable;
use Illuminate\Database\Query\Builder;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

final class CategoryInsightsQuery
{
    public function handle(Category $category, User $user): array
    {
        $currency = $user->preferred_currency->value;

        $direct = $this->directTransactions($user, $category->id, $currency);
        $splits = $this->splitTransactions($user, $category->id, $currency);

        $totalDebits = $this->sumByType($direct, TransactionType::DEBIT, 'transactions.amount')
            + $this->sumByType($splits, TransactionType::DEBIT, 'transaction_splits.amount');

        $totalCredits = $this->sumByType($direct, TransactionType::CREDIT, 'transactions.amount', false)
            + $this->sumByType($splits, TransactionType::CREDIT, 'transaction_splits.amount', false);

        $monthly = $this->monthlyTotals($direct, $splits);

        $accounts = $this->accountBreakdown($direct, $splits);

        return [
            'total_debits'  => new Money($totalDebits, $user->preferred_currency),
            'total_credits' => new Money($totalCredits, $user->preferred_currency),
            'net_total'     => new Money($totalCredits - $totalDebits, $user->preferred_currency),
            'monthly'       => $monthly,
            'accounts'      => $accounts,
        ];
    }

    public function resource(Category $category, User $user): CategoryInsightsResource
    {
        $data = $this->handle($category, $user);

        return new CategoryInsightsResource(
            total_debits: $data['total_debits'],
            total_credits: $data['total_credits'],
            net_total: $data['net_total'],
            monthly: array_map(fn ($item) => new CategoryMonthlyTotalResource(
                month: $item['month'],
                debits: new Money($item['debits'], $user->preferred_currency),
                credits: new Money($item['credits'], $user->preferred_currency),
            ), $data['monthly']),
            accounts: array_map(fn ($item) => new CategoryAccountBreakdownResource(
                account_id: $item['account_id'],
                account_name: $item['account_name'],
                debits: new Money($item['debits'], $user->preferred_currency),
                credits: new Money($item['credits'], $user->preferred_currency),
            ), $data['accounts']),
        );
    }

    private function directTransactions(User $user, string $categoryId, string $currency): Builder
    {
        return DB::table('transactions')
            ->join('accounts', 'accounts.id', '=', 'transactions.account_id')
            ->where('accounts.user_id', $user->id)
            ->where('transactions.category_id', $categoryId)
            ->where('transactions.currency', $currency);
    }

    private function splitTransactions(User $user, string $categoryId, string $currency): Builder
    {
        return DB::table('transaction_splits')
            ->join('transactions', 'transactions.id', '=', 'transaction_splits.transaction_id')
            ->join('accounts', 'accounts.id', '=', 'transactions.account_id')
            ->where('accounts.user_id', $user->id)
            ->where('transaction_splits.category_id', $categoryId)
            ->where('transactions.currency', $currency);
    }

    private function sumByType(Builder $query, TransactionType $type, string $column, bool $absolute = true): int
    {
        $clone = clone $query;

        $sumExpression = $absolute ? "COALESCE(SUM(ABS($column)), 0)" : "COALESCE(SUM($column), 0)";

        return (int) $clone
            ->where('transactions.type', $type->value)
            ->selectRaw("$sumExpression as total")
            ->value('total');
    }

    /**
     * @return array<int, array{month: string, debits: int, credits: int}>
     */
    private function monthlyTotals(Builder $direct, Builder $splits): array
    {
        $end = CarbonImmutable::now()->endOfMonth();
        $start = $end->copy()->subMonths(5)->startOfMonth();

        $buckets = collect(range(0, 5))
            ->map(fn (int $offset) => $start->addMonths($offset))
            ->mapWithKeys(fn (CarbonImmutable $month) => [
                $month->format('Y-m') => [
                    'month'   => $month->toDateString(),
                    'debits'  => 0,
                    'credits' => 0,
                ],
            ]);

        $this->aggregateMonthly($buckets, clone $direct, 'transactions.date', 'transactions.amount');
        $this->aggregateMonthly($buckets, clone $splits, 'transactions.date', 'transaction_splits.amount');

        return $buckets->values()->all();
    }

    /**
     * @param  Collection<string, array{month: string, debits: int, credits: int}>  $buckets
     */
    private function aggregateMonthly(Collection $buckets, Builder $query, string $dateColumn, string $amountColumn): void
    {
        $results = $query
            ->whereBetween($dateColumn, [
                $buckets->first()['month'],
                CarbonImmutable::parse($buckets->last()['month'])->endOfMonth(),
            ])
            ->selectRaw("DATE_TRUNC('month', $dateColumn) as month")
            ->selectRaw('transactions.type')
            ->selectRaw("SUM(ABS($amountColumn)) as total")
            ->groupByRaw("DATE_TRUNC('month', $dateColumn), transactions.type")
            ->get();

        foreach ($results as $row) {
            $key = CarbonImmutable::parse($row->month)->format('Y-m');
            if (! $buckets->has($key)) {
                continue;
            }

            $bucket = $buckets->get($key);

            if ($row->type === TransactionType::DEBIT->value) {
                $bucket['debits'] += (int) $row->total;
            } else {
                $bucket['credits'] += (int) $row->total;
            }

            $buckets->put($key, $bucket);
        }
    }

    /**
     * @return array<int, array{account_id: string, account_name: string, debits: int, credits: int}>
     */
    private function accountBreakdown(Builder $direct, Builder $splits): array
    {
        $accounts = collect();

        $directResults = (clone $direct)
            ->select('transactions.account_id', 'accounts.name as account_name', 'transactions.type')
            ->selectRaw('SUM(ABS(transactions.amount)) as total')
            ->groupBy('transactions.account_id', 'accounts.name', 'transactions.type')
            ->get();

        $splitResults = (clone $splits)
            ->select('transactions.account_id', 'accounts.name as account_name', 'transactions.type')
            ->selectRaw('SUM(ABS(transaction_splits.amount)) as total')
            ->groupBy('transactions.account_id', 'accounts.name', 'transactions.type')
            ->get();

        foreach ($directResults->merge($splitResults) as $row) {
            $accountId = $row->account_id;
            $entry = $accounts->get($accountId, [
                'account_id'   => $accountId,
                'account_name' => $row->account_name,
                'debits'       => 0,
                'credits'      => 0,
            ]);

            if ($row->type === TransactionType::DEBIT->value) {
                $entry['debits'] += (int) $row->total;
            } else {
                $entry['credits'] += (int) $row->total;
            }

            $accounts->put($accountId, $entry);
        }

        return $accounts
            ->sortByDesc(fn ($entry) => $entry['debits'])
            ->values()
            ->all();
    }
}
