<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Actions\Budget\CreateBudget;
use App\Actions\Budget\DeleteBudget;
use App\Actions\Budget\UpdateBudget;
use App\Http\Controllers\Controller;
use App\Http\Requests\Budget\StoreBudgetRequest;
use App\Http\Requests\Budget\UpdateBudgetRequest;
use App\Http\Resources\BudgetResource;
use App\Models\Budget;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;

final class BudgetController extends Controller
{
    public function index(): JsonResponse
    {
        $user = Auth::user();
        abort_unless($user, 403);

        $budgets = $user->budgets()->with('category')->get();

        return response()->json(
            BudgetResource::collect($budgets)->toArray()
        );
    }

    public function show(Budget $budget): JsonResponse
    {
        Gate::authorize('view', $budget);

        return response()->json(
            BudgetResource::from($budget->load('category'))->toArray()
        );
    }

    public function store(StoreBudgetRequest $request, CreateBudget $action): JsonResponse
    {
        $user = Auth::user();
        abort_unless($user, 403);

        $budget = $action->handle($request, $user)->load('category');

        return response()->json(
            BudgetResource::from($budget)->toArray(),
            201
        );
    }

    public function update(UpdateBudgetRequest $request, Budget $budget, UpdateBudget $action): JsonResponse
    {
        Gate::authorize('update', $budget);

        $updated = $action->handle($request, $budget)->load('category');

        return response()->json(
            BudgetResource::from($updated)->toArray()
        );
    }

    public function destroy(Budget $budget, DeleteBudget $action): JsonResponse
    {
        Gate::authorize('delete', $budget);

        if (! $action->handle($budget)) {
            return response()->json([
                'message' => __('Failed to delete budget.'),
            ], 422);
        }

        return response()->json(status: 204);
    }
}
