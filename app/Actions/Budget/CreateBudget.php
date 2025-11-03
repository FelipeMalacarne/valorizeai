<?php

declare(strict_types=1);

namespace App\Actions\Budget;

use App\Http\Requests\Budget\StoreBudgetRequest;
use App\Models\Budget;
use App\Models\Category;
use App\Models\User;
use Illuminate\Database\Eloquent\ModelNotFoundException;

final class CreateBudget
{
    public function handle(StoreBudgetRequest $data, User $user): Budget
    {
        $category = Category::query()
            ->whereKey($data->category_id)
            ->where(function ($query) use ($user) {
                $query->whereNull('user_id')
                    ->orWhere('user_id', $user->id);
            })
            ->first();

        if (! $category) {
            throw new ModelNotFoundException(__('Category not found.'));
        }

        return Budget::firstOrCreate(
            [
                'user_id'     => $user->id,
                'category_id' => $category->id,
            ],
            [
                'name'     => $data->name ?? $category->name,
                'currency' => $user->preferred_currency,
            ],
        );
    }
}
