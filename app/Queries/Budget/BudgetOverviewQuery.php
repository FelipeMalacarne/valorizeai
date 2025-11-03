<?php

declare(strict_types=1);

namespace App\Queries\Budget;

use App\Enums\TransactionType;
use App\Http\Resources\BudgetOverviewResource;
use App\Http\Resources\CategoryResource;
use App\Models\Budget;
use App\Models\User;
use App\ValueObjects\Money;
use Carbon\CarbonImmutable;
use Illuminate\Database\Query\Builder;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

final class BudgetOverviewQuery
{
    /**
     * @return Collection<int, array{id: string, currency: \App\Enums\Currency, category: CategoryResource, budgeted_amount: Money, spent_amount: Money, rollover_amount: Money, remaining_amount: Money}>
     */
    public function handle(User $user, CarbonImmutable $month): Collection
    {
        /** @var Collection<int, Budget> $budgets */
        $budgets = Budget::query()
            ->with('category')
            ->where('user_id', $user->id)
            ->orderBy('name')
            ->get();

        if ($budgets->isEmpty()) {
            return collect();
        }

        $budgetIds = $budgets->pluck('id');
        $categoryIds = $budgets->pluck('category_id');

        $startOfMonth = $month->startOfMonth();
        $endOfMonth = $month->endOfMonth();

        $allocationsForMonth = $this->allocationsForMonth($budgetIds, $startOfMonth);
        $allocationsBeforeMonth = $this->allocationsBeforeMonth($budgetIds, $startOfMonth);

        $spentThisMonth = $this->spentForPeriod($categoryIds, $user->preferred_currency->value, $startOfMonth, $endOfMonth);
        $spentBeforeMonth = $this->spentBefore($categoryIds, $user->preferred_currency->value, $startOfMonth);

        return $budgets
            ->sortBy(fn (Budget $budget) => $budget->category->name ?? $budget->name, SORT_NATURAL | SORT_FLAG_CASE)
            ->values()
            ->map(function (Budget $budget) use (
                $allocationsForMonth,
                $allocationsBeforeMonth,
                $spentThisMonth,
                $spentBeforeMonth
            ) {
                $currency = $budget->currency;
                $budgetedValue = (int) ($allocationsForMonth[$budget->id] ?? 0);
                $priorBudgetedValue = (int) ($allocationsBeforeMonth[$budget->id] ?? 0);
                $spentValue = (int) ($spentThisMonth[$budget->category_id] ?? 0);
                $spentBeforeValue = (int) ($spentBeforeMonth[$budget->category_id] ?? 0);

                $rolloverValue = $priorBudgetedValue - $spentBeforeValue;
                $remainingValue = $rolloverValue + $budgetedValue - $spentValue;

                return [
                    'id'               => $budget->id,
                    'currency'         => $currency,
                    'category'         => CategoryResource::from($budget->category),
                    'budgeted_amount'  => new Money($budgetedValue, $currency),
                    'spent_amount'     => new Money($spentValue, $currency),
                    'rollover_amount'  => new Money($rolloverValue, $currency),
                    'remaining_amount' => new Money($remainingValue, $currency),
                ];
            });
    }

    public function resource(User $user, CarbonImmutable $month): Collection
    {
        return BudgetOverviewResource::collect($this->handle($user, $month));
    }

    /**
     * @param  Collection<int, string>  $budgetIds
     * @return array<string, int>
     */
    private function allocationsForMonth(Collection $budgetIds, CarbonImmutable $month): array
    {
        if ($budgetIds->isEmpty()) {
            return [];
        }

        return DB::table('budget_allocations')
            ->select('budget_id', DB::raw('SUM(budgeted_amount) as total'))
            ->whereIn('budget_id', $budgetIds)
            ->whereDate('month', $month->toDateString())
            ->groupBy('budget_id')
            ->pluck('total', 'budget_id')
            ->map(fn ($total) => (int) $total)
            ->all();
    }

    /**
     * @param  Collection<int, string>  $budgetIds
     * @return array<string, int>
     */
    private function allocationsBeforeMonth(Collection $budgetIds, CarbonImmutable $month): array
    {
        if ($budgetIds->isEmpty()) {
            return [];
        }

        return DB::table('budget_allocations')
            ->select('budget_id', DB::raw('SUM(budgeted_amount) as total'))
            ->whereIn('budget_id', $budgetIds)
            ->whereDate('month', '<', $month->toDateString())
            ->groupBy('budget_id')
            ->pluck('total', 'budget_id')
            ->map(fn ($total) => (int) $total)
            ->all();
    }

    /**
     * @param  Collection<int, string>  $categoryIds
     * @return array<string, int>
     */
    private function spentForPeriod(
        Collection $categoryIds,
        string $currency,
        CarbonImmutable $start,
        CarbonImmutable $end
    ): array {
        if ($categoryIds->isEmpty()) {
            return [];
        }

        $transactions = $this->baseTransactionQuery($categoryIds, $currency)
            ->whereBetween('date', [$start, $end])
            ->whereNotExists(function (Builder $query) {
                $query->select(DB::raw(1))
                    ->from('transaction_splits')
                    ->whereColumn('transaction_splits.transaction_id', 'transactions.id');
            })
            ->pluck('total', 'category_id')
            ->map(fn ($total) => (int) $total)
            ->all();

        $splits = $this->baseSplitQuery($categoryIds, $currency)
            ->whereBetween('transactions.date', [$start, $end])
            ->pluck('total', 'category_id')
            ->map(fn ($total) => (int) $total)
            ->all();

        return $this->mergeSpendResults($transactions, $splits);
    }

    /**
     * @param  Collection<int, string>  $categoryIds
     * @return array<string, int>
     */
    private function spentBefore(Collection $categoryIds, string $currency, CarbonImmutable $start): array
    {
        if ($categoryIds->isEmpty()) {
            return [];
        }

        $transactions = $this->baseTransactionQuery($categoryIds, $currency)
            ->where('date', '<', $start)
            ->whereNotExists(function (Builder $query) {
                $query->select(DB::raw(1))
                    ->from('transaction_splits')
                    ->whereColumn('transaction_splits.transaction_id', 'transactions.id');
            })
            ->pluck('total', 'category_id')
            ->map(fn ($total) => (int) $total)
            ->all();

        $splits = $this->baseSplitQuery($categoryIds, $currency)
            ->where('transactions.date', '<', $start)
            ->pluck('total', 'category_id')
            ->map(fn ($total) => (int) $total)
            ->all();

        return $this->mergeSpendResults($transactions, $splits);
    }

    /**
     * @param  array<string, int>  ...$sources
     * @return array<string, int>
     */
    private function mergeSpendResults(array ...$sources): array
    {
        $result = [];

        foreach ($sources as $dataset) {
            foreach ($dataset as $categoryId => $total) {
                $result[$categoryId] = ($result[$categoryId] ?? 0) + (int) $total;
            }
        }

        return $result;
    }

    /**
     * @param  Collection<int, string>  $categoryIds
     */
    private function baseTransactionQuery(Collection $categoryIds, string $currency): Builder
    {
        return DB::table('transactions')
            ->select('category_id', DB::raw('SUM(ABS(amount)) as total'))
            ->whereIn('category_id', $categoryIds)
            ->whereNotNull('category_id')
            ->where('currency', $currency)
            ->where('type', TransactionType::DEBIT->value)
            ->groupBy('category_id');
    }

    /**
     * @param  Collection<int, string>  $categoryIds
     */
    private function baseSplitQuery(Collection $categoryIds, string $currency): Builder
    {
        return DB::table('transaction_splits')
            ->select('transaction_splits.category_id', DB::raw('SUM(ABS(transaction_splits.amount)) as total'))
            ->join('transactions', 'transactions.id', '=', 'transaction_splits.transaction_id')
            ->whereIn('transaction_splits.category_id', $categoryIds)
            ->whereNotNull('transaction_splits.category_id')
            ->where('transactions.currency', $currency)
            ->where('transactions.type', TransactionType::DEBIT->value)
            ->groupBy('transaction_splits.category_id');
    }
}
