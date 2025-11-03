<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\Budget\AllocateBudget;
use App\Actions\Budget\CreateBudget;
use App\Actions\Budget\DeleteBudget;
use App\Actions\Budget\MoveMoneyBetweenBudgets;
use App\Actions\Budget\UpdateBudget;
use App\Actions\Budget\UpsertMonthlyIncome;
use App\Http\Requests\Budget\AllocateBudgetRequest;
use App\Http\Requests\Budget\IndexBudgetRequest;
use App\Http\Requests\Budget\MoveBudgetAllocationRequest;
use App\Http\Requests\Budget\StoreBudgetRequest;
use App\Http\Requests\Budget\UpdateBudgetRequest;
use App\Http\Requests\Budget\UpdateMonthlyIncomeRequest;
use App\Http\Resources\BudgetMonthlySummaryResource;
use App\Http\Resources\BudgetResource;
use App\Models\Budget;
use App\Models\BudgetMonthlyConfig;
use App\Models\User;
use App\Queries\Budget\BudgetOverviewQuery;
use App\Queries\Category\UserCategoriesQuery;
use App\ValueObjects\Money;
use Carbon\CarbonImmutable;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

final class BudgetController extends Controller
{
    public function index(
        IndexBudgetRequest $request,
        BudgetOverviewQuery $overview,
        UserCategoriesQuery $categories
    ): Response {
        $user = Auth::user();
        $month = $this->resolveMonth($request->month);

        $budgets = $user->budgets()->with('category')->get();
        $monthlySummary = $this->buildMonthlySummary($user, $month);

        return Inertia::render('budgets/index', [
            'filters' => [
                'month' => $month->format('Y-m'),
            ],
            'overview'        => fn () => $overview->resource($user, $month),
            'budgets'         => fn () => BudgetResource::collect($budgets),
            'categories'      => fn () => $categories->resource($user->id),
            'monthly_summary' => fn () => $monthlySummary,
        ]);
    }

    public function store(StoreBudgetRequest $request, CreateBudget $action): RedirectResponse
    {
        $budget = $action->handle($request, Auth::user());

        return redirect()->back()->with([
            'success' => __('Budget :name created successfully.', ['name' => $budget->name]),
        ]);
    }

    public function update(UpdateBudgetRequest $request, Budget $budget, UpdateBudget $action): RedirectResponse
    {
        Gate::authorize('update', $budget);

        $action->handle($request, $budget);

        return redirect()->back()->with([
            'success' => __('Budget :name updated successfully.', ['name' => $budget->name]),
        ]);
    }

    public function destroy(Budget $budget, DeleteBudget $action): RedirectResponse
    {
        Gate::authorize('delete', $budget);

        $action->handle($budget);

        return redirect()->back()->with([
            'success' => __('Budget :name deleted successfully.', ['name' => $budget->name]),
        ]);
    }

    public function allocate(AllocateBudgetRequest $request, AllocateBudget $action): RedirectResponse
    {
        $action->handle($request, Auth::user());

        return redirect()->back()->with([
            'success' => __('Budget updated successfully.'),
        ]);
    }

    public function move(MoveBudgetAllocationRequest $request, MoveMoneyBetweenBudgets $action): RedirectResponse
    {
        $action->handle($request, Auth::user());

        return redirect()->back()->with([
            'success' => __('Money moved between budgets successfully.'),
        ]);
    }

    public function updateMonthlyIncome(UpdateMonthlyIncomeRequest $request, UpsertMonthlyIncome $action): RedirectResponse
    {
        $action->handle($request, Auth::user());

        return redirect()->back()->with([
            'success' => __('Renda mensal atualizada.'),
        ]);
    }

    private function resolveMonth(?string $month): CarbonImmutable
    {
        if ($month) {
            return CarbonImmutable::createFromFormat('Y-m', $month)->startOfMonth();
        }

        return now()->toImmutable()->startOfMonth();
    }

    private function buildMonthlySummary(User $user, CarbonImmutable $month): BudgetMonthlySummaryResource
    {
        $config = BudgetMonthlyConfig::forUserAndMonth($user->id, $month);

        $totalAllocated = (int) DB::table('budget_allocations')
            ->join('budgets', 'budget_allocations.budget_id', '=', 'budgets.id')
            ->where('budgets.user_id', $user->id)
            ->whereDate('budget_allocations.month', $month->toDateString())
            ->sum('budget_allocations.budgeted_amount');

        $currency = $user->preferred_currency;

        $hasIncome = $config !== null;

        $incomeValue = $hasIncome ? (int) $config->income_amount : null;
        $configuredMonth = $config?->month;
        $isInherited = $hasIncome ? ! $configuredMonth->isSameDay($month) : false;

        return BudgetMonthlySummaryResource::from([
            'has_income'   => $hasIncome,
            'is_inherited' => $hasIncome ? $isInherited : false,
            'income_month' => $hasIncome ? $configuredMonth->format('Y-m') : null,
            'income'       => $hasIncome ? new Money($incomeValue ?? 0, $currency) : null,
            'assigned'     => new Money($totalAllocated, $currency),
            'unassigned'   => $hasIncome ? new Money(($incomeValue ?? 0) - $totalAllocated, $currency) : null,
        ]);
    }
}
