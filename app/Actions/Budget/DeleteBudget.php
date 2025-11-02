<?php

declare(strict_types=1);

namespace App\Actions\Budget;

use App\Models\Budget;

final class DeleteBudget
{
    public function handle(Budget $budget): bool
    {
        return (bool) $budget->delete();
    }
}
