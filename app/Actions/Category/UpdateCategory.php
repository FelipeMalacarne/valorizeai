<?php

declare(strict_types=1);

namespace App\Actions\Category;

use App\Http\Requests\Category\UpdateCategoryRequest;
use App\Models\Category;
use Illuminate\Support\Facades\DB;

final class UpdateCategory
{
    public function handle(UpdateCategoryRequest $data, Category $category): Category
    {
        return DB::transaction(function () use ($data, $category) {
            $category->update([
                'name'        => $data->name,
                'description' => $data->description,
                'color'       => $data->color,
                'is_default'  => $data->is_default,
            ]);

            return $category->fresh();
        });
    }
}
