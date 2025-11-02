<?php

declare(strict_types=1);

namespace App\Actions\Budget;

use App\Http\Requests\Budget\AllocateBudgetRequest;
use App\Models\Budget;
use App\Models\BudgetAllocation;
use App\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

final class AllocateBudget
{
    public function handle(AllocateBudgetRequest $data, User $user): BudgetAllocation
    {
        return DB::transaction(function () use ($data, $user) {
            /** @var Budget $budget */
            $budget = Budget::query()
                ->whereKey($data->budget_id)
                ->where('user_id', $user->id)
                ->firstOrFail();

            if ($budget->currency !== $data->amount->currency) {
                throw new InvalidArgumentException(__('Budget currency mismatch.'));
            }

            $month = CarbonImmutable::createFromFormat('Y-m', $data->month)->startOfMonth();

            return $budget->allocations()->updateOrCreate(
                [
                    'month' => $month,
                ],
                [
                    'budgeted_amount' => $data->amount->value,
                ],
            );
        });
    }
}
