<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\Category;
use App\Models\User;

final class CategoryPolicy
{
    public function view(User $user, Category $category): bool
    {
        return $category->user_id === null || $user->id === $category->user_id;

    }

    public function update(User $user, Category $category): bool
    {
        return $user->id === $category->user_id;
    }

    public function delete(User $user, Category $category): bool
    {
        return $user->id === $category->user_id;
    }
}
