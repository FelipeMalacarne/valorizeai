<?php

declare(strict_types=1);

namespace App\Actions\Budget;

use App\Exceptions\BudgetAllocationLimitExceeded;
use App\Http\Requests\Budget\AllocateBudgetRequest;
use App\Models\Budget;
use App\Models\BudgetAllocation;
use App\Models\BudgetMonthlyConfig;
use App\Models\User;
use App\ValueObjects\Money;
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

            /** @var BudgetAllocation $allocation */
            $allocation = $budget->allocations()->firstOrNew([
                'month' => $month,
            ]);

            $currentValue = $allocation->exists ? (int) $allocation->budgeted_amount : 0;
            $totalAllocated = $user->totalBudgetedForMonth($month);

            $config = BudgetMonthlyConfig::forUserAndMonth($user->id, $month);

            if ($config) {
                $allocatedExcludingCurrent = $totalAllocated - $currentValue;
                $remaining = $config->remainingIncome($allocatedExcludingCurrent);

                if ($data->amount->value > max($remaining, 0)) {
                    throw new BudgetAllocationLimitExceeded(
                        new Money(
                            max($remaining, 0),
                            $user->preferred_currency
                        )
                    );
                }
            }

            $allocation->budgeted_amount = $data->amount->value;
            $allocation->save();

            return $allocation;
        });
    }
}
