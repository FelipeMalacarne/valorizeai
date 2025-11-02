<?php

declare(strict_types=1);

namespace App\Queries\Category;

use App\Http\Resources\CategoryResource;
use App\Models\Category;
use Illuminate\Support\Collection;

final class UserCategoriesQuery
{
    public function handle(string $userId)
    {
        return Category::forUser($userId)
            ->orderBy('is_default', 'desc')
            ->orderBy('name')
            ->get();
    }

    /** @return Collection<int, CategoryResource> */
    public function resource(string $userId): Collection
    {
        return CategoryResource::collect($this->handle($userId));
    }
}
