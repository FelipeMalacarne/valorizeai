<?php

declare(strict_types=1);

namespace App\Domain\Category\Queries;

use App\Domain\Category\Projections\Category;
use App\Support\CQRS\QueryHandler;
use Illuminate\Support\Collection;

final class ListCategoriesQueryHandler implements QueryHandler
{
    /**
     * @return Collection<int, Category>
     */
    public function handle(ListCategoriesQuery $query): Collection
    {
        return Category::query()
            ->whereUser($query->user_id)
            ->get();
    }
}
