<?php

declare(strict_types=1);

namespace App\Actions\Category;

use App\Http\Requests\Category\CreateCategoryRequest;
use App\Models\Category;
use App\Models\User;
use Illuminate\Support\Facades\DB;

final class CreateCategory
{
    public function handle(CreateCategoryRequest $data, User $user): Category
    {
        return DB::transaction(function () use ($data, $user) {
            return Category::create([
                'name'        => $data->name,
                'description' => $data->description,
                'color'       => $data->color,
                'is_default'  => false,
                'user_id'     => $user->id,
            ]);
        });
    }
}
