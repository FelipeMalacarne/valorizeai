<?php

declare(strict_types=1);

namespace App\Actions\Category;

use App\Models\Category;
use Illuminate\Support\Facades\DB;

final class DeleteCategory
{
    public function handle(Category $category): bool
    {
        return DB::transaction(function () use ($category) {
            return $category->delete();
        });
    }
}
