<?php

declare(strict_types=1);

namespace App\Actions\Budget;

use App\Http\Requests\Budget\MoveBudgetAllocationRequest;
use App\Models\Budget;
use App\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

final class MoveMoneyBetweenBudgets
{
    public function handle(MoveBudgetAllocationRequest $data, User $user): void
    {
        if ($data->amount->value <= 0) {
            throw new InvalidArgumentException(__('The transfer amount must be greater than zero.'));
        }

        DB::transaction(function () use ($data, $user) {
            /** @var Budget $fromBudget */
            $fromBudget = Budget::query()
                ->whereKey($data->from_budget_id)
                ->where('user_id', $user->id)
                ->firstOrFail();

            /** @var Budget $toBudget */
            $toBudget = Budget::query()
                ->whereKey($data->to_budget_id)
                ->where('user_id', $user->id)
                ->firstOrFail();

            if ($fromBudget->currency !== $data->amount->currency || $toBudget->currency !== $data->amount->currency) {
                throw new InvalidArgumentException(__('Budget currency mismatch.'));
            }

            $month = CarbonImmutable::createFromFormat('Y-m', $data->month)->startOfMonth();

            $fromAllocation = $fromBudget->allocations()->firstOrCreate(
                ['month' => $month],
                ['budgeted_amount' => 0],
            );

            $toAllocation = $toBudget->allocations()->firstOrCreate(
                ['month' => $month],
                ['budgeted_amount' => 0],
            );

            $fromAllocation->budgeted_amount -= $data->amount->value;
            $fromAllocation->save();

            $toAllocation->budgeted_amount += $data->amount->value;
            $toAllocation->save();
        });
    }
}
