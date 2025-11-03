<?php

declare(strict_types=1);

namespace App\Queries\Dashboard;

use App\Enums\TransactionType;
use App\Http\Resources\AccountResource;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\DashboardCategoryShareResource;
use App\Http\Resources\DashboardMonthlyTrendResource;
use App\Http\Resources\DashboardSummaryResource;
use App\Http\Resources\TransactionResource;
use App\Models\Category;
use App\Models\User;
use App\ValueObjects\Money;
use Carbon\CarbonImmutable;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

final class DashboardOverviewQuery
{
    public function handle(User $user, CarbonImmutable $referenceMonth): array
    {
        $currency = $user->preferred_currency->value;

        $user->loadMissing('accounts');

        $summary = $this->summary($user, $currency, $referenceMonth);
        $monthlyTrend = $this->monthlyTrend($user, $currency, $referenceMonth);
        $categorySpending = $this->categorySpending($user, $currency, $referenceMonth);
        $accounts = $user->accounts()->with('bank')->orderBy('name')->get();
        $recentTransactions = $user->transactions()
            ->with(['account.bank', 'category'])
            ->orderByDesc('date')
            ->limit(8)
            ->get();

        return [
            'summary'             => new DashboardSummaryResource(...$summary),
            'monthly_trend'       => DashboardMonthlyTrendResource::collect($monthlyTrend),
            'category_spending'   => DashboardCategoryShareResource::collect($categorySpending),
            'accounts'            => AccountResource::collect($accounts),
            'recent_transactions' => TransactionResource::collect($recentTransactions),
        ];
    }

    /**
     * @return array{total_balance: Money, monthly_income: Money, monthly_expense: Money, monthly_profit: Money}
     */
    private function summary(User $user, string $currency, CarbonImmutable $referenceMonth): array
    {
        $preferredCurrency = $user->preferred_currency;

        $totalBalance = $user->accounts
            ->filter(fn ($account) => $account->currency->value === $currency)
            ->reduce(
                fn (int $carry, $account) => $carry + $account->balance->value,
                0
            );

        $monthStart = $referenceMonth->startOfMonth();
        $monthEnd = $referenceMonth->endOfMonth();

        $monthly = DB::table('transactions')
            ->join('accounts', 'accounts.id', '=', 'transactions.account_id')
            ->where('accounts.user_id', $user->id)
            ->where('transactions.currency', $currency)
            ->whereBetween('transactions.date', [$monthStart, $monthEnd])
            ->selectRaw("
                SUM(CASE WHEN transactions.type = 'credit' THEN ABS(transactions.amount) ELSE 0 END) as income,
                SUM(CASE WHEN transactions.type = 'debit' THEN ABS(transactions.amount) ELSE 0 END) as expense
            ")
            ->first();

        $income = (int) ($monthly->income ?? 0);
        $expense = (int) ($monthly->expense ?? 0);

        return [
            'total_balance'   => new Money($totalBalance, $preferredCurrency),
            'monthly_income'  => new Money($income, $preferredCurrency),
            'monthly_expense' => new Money($expense, $preferredCurrency),
            'monthly_profit'  => new Money($income - $expense, $preferredCurrency),
        ];
    }

    /**
     * @return array<int, DashboardMonthlyTrendResource>
     */
    private function monthlyTrend(User $user, string $currency, CarbonImmutable $referenceMonth): array
    {
        $end = $referenceMonth->endOfMonth();
        $start = $end->copy()->subMonths(5)->startOfMonth();

        $results = DB::table('transactions')
            ->join('accounts', 'accounts.id', '=', 'transactions.account_id')
            ->where('accounts.user_id', $user->id)
            ->where('transactions.currency', $currency)
            ->whereBetween('transactions.date', [$start, $end])
            ->selectRaw("DATE_TRUNC('month', transactions.date) as month")
            ->selectRaw("
                SUM(CASE WHEN transactions.type = 'credit' THEN ABS(transactions.amount) ELSE 0 END) as income,
                SUM(CASE WHEN transactions.type = 'debit' THEN ABS(transactions.amount) ELSE 0 END) as expense
            ")
            ->groupByRaw("DATE_TRUNC('month', transactions.date)")
            ->get()
            ->keyBy(fn ($row) => CarbonImmutable::parse($row->month)->format('Y-m'));

        $buckets = collect(range(0, 5))
            ->map(fn (int $offset) => $start->addMonths($offset))
            ->map(function (CarbonImmutable $month) use ($results, $user) {
                $key = $month->format('Y-m');
                $row = $results->get($key);

                $income = (int) ($row->income ?? 0);
                $expense = (int) ($row->expense ?? 0);

                return new DashboardMonthlyTrendResource(
                    month: $month->toDateString(),
                    income: new Money($income, $user->preferred_currency),
                    expense: new Money($expense, $user->preferred_currency),
                    profit: new Money($income - $expense, $user->preferred_currency),
                );
            });

        return $buckets->all();
    }

    /**
     * @return array<int, DashboardCategoryShareResource>
     */
    private function categorySpending(User $user, string $currency, CarbonImmutable $referenceMonth): array
    {
        return $this->categoryTotalsForMonth($user, $currency, $referenceMonth)->values()->all();
    }

    /**
     * @return Collection<int, DashboardCategoryShareResource>
     */
    private function categoryTotalsForMonth(User $user, string $currency, CarbonImmutable $month): Collection
    {
        $start = $month->startOfMonth();
        $end = $month->endOfMonth();

        $direct = DB::table('transactions')
            ->join('accounts', 'accounts.id', '=', 'transactions.account_id')
            ->where('accounts.user_id', $user->id)
            ->where('transactions.currency', $currency)
            ->whereBetween('transactions.date', [$start, $end])
            ->where('transactions.type', TransactionType::DEBIT->value)
            ->whereNotNull('transactions.category_id')
            ->select('transactions.category_id as category_id')
            ->selectRaw('SUM(ABS(transactions.amount)) as total')
            ->groupBy('transactions.category_id');

        $splits = DB::table('transaction_splits')
            ->join('transactions', 'transactions.id', '=', 'transaction_splits.transaction_id')
            ->join('accounts', 'accounts.id', '=', 'transactions.account_id')
            ->where('accounts.user_id', $user->id)
            ->where('transactions.currency', $currency)
            ->whereBetween('transactions.date', [$start, $end])
            ->where('transactions.type', TransactionType::DEBIT->value)
            ->whereNotNull('transaction_splits.category_id')
            ->select('transaction_splits.category_id as category_id')
            ->selectRaw('SUM(ABS(transaction_splits.amount)) as total')
            ->groupBy('transaction_splits.category_id');

        $totals = collect();

        foreach ($direct->unionAll($splits)->get() as $row) {
            $totals[$row->category_id] = ($totals[$row->category_id] ?? 0) + (int) $row->total;
        }

        if ($totals->isEmpty()) {
            return collect();
        }

        $categoryModels = Category::whereIn('id', $totals->keys())->get()->keyBy('id');
        $sum = $totals->sum();

        return $totals
            ->map(function (int $total, string $categoryId) use ($categoryModels, $sum, $user) {
                $category = $categoryModels->get($categoryId);
                if (! $category) {
                    return null;
                }

                return new DashboardCategoryShareResource(
                    category: CategoryResource::from($category),
                    total: new Money($total, $user->preferred_currency),
                    percentage: $sum > 0 ? round(($total / $sum) * 100, 2) : 0.0,
                );
            })
            ->filter()
            ->sortByDesc(fn (DashboardCategoryShareResource $resource) => $resource->total->value)
            ->take(5)
            ->values();
    }
}
