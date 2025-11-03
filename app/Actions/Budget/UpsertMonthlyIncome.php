<?php

declare(strict_types=1);

namespace App\Actions\Budget;

use App\Http\Requests\Budget\UpdateMonthlyIncomeRequest;
use App\Models\BudgetMonthlyConfig;
use App\Models\User;
use Carbon\CarbonImmutable;

final class UpsertMonthlyIncome
{
    public function handle(UpdateMonthlyIncomeRequest $request, User $user): BudgetMonthlyConfig
    {
        $month = CarbonImmutable::createFromFormat('Y-m', $request->month)->startOfMonth();

        return BudgetMonthlyConfig::query()->updateOrCreate(
            [
                'user_id' => $user->id,
                'month'   => $month,
            ],
            [
                'income_amount' => $request->amount->value,
            ],
        );
    }
}
