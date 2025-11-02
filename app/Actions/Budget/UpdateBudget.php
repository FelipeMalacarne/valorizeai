<?php

declare(strict_types=1);

namespace App\Actions\Budget;

use App\Http\Requests\Budget\UpdateBudgetRequest;
use App\Models\Budget;

final class UpdateBudget
{
    public function handle(UpdateBudgetRequest $data, Budget $budget): Budget
    {
        $budget->update([
            'name' => $data->name,
        ]);

        return $budget;
    }
}
