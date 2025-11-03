<?php

declare(strict_types=1);

namespace App\Queries;

use App\Http\Requests\Category\ListCategoriesRequest;
use App\Models\Category;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;

final class ListCategoriesQuery
{
    /** @return Collection<int, Category> */
    public function handle(ListCategoriesRequest $data, User $user): Collection
    {
        $query = Category::forUser($user->id);

        if ($data->search) {
            $query->where(function (Builder $query) use ($data) {
                $query->where('name', 'like', "%{$data->search}%")
                    ->orWhere('description', 'like', "%{$data->search}%");
            });
        }

        if ($data->is_default !== null) {
            $query->where('is_default', $data->is_default);
        }

        $query->orderBy('is_default', 'desc')
            ->orderBy('name');

        return $query->get();
    }
}
