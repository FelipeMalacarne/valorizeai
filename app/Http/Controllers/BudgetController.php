<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\Budget\AllocateBudget;
use App\Actions\Budget\CreateBudget;
use App\Actions\Budget\DeleteBudget;
use App\Actions\Budget\MoveMoneyBetweenBudgets;
use App\Actions\Budget\UpdateBudget;
use App\Http\Requests\Budget\AllocateBudgetRequest;
use App\Http\Requests\Budget\IndexBudgetRequest;
use App\Http\Requests\Budget\MoveBudgetAllocationRequest;
use App\Http\Requests\Budget\StoreBudgetRequest;
use App\Http\Requests\Budget\UpdateBudgetRequest;
use App\Http\Resources\BudgetResource;
use App\Models\Budget;
use App\Queries\Budget\BudgetOverviewQuery;
use App\Queries\Category\UserCategoriesQuery;
use Carbon\CarbonImmutable;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
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

        return Inertia::render('budgets/index', [
            'filters' => [
                'month' => $month->format('Y-m'),
            ],
            'overview'   => fn () => $overview->resource($user, $month),
            'budgets'    => fn () => BudgetResource::collect($budgets),
            'categories' => fn () => $categories->resource($user->id),
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

    private function resolveMonth(?string $month): CarbonImmutable
    {
        if ($month) {
            return CarbonImmutable::createFromFormat('Y-m', $month)->startOfMonth();
        }

        return now()->toImmutable()->startOfMonth();
    }
}
