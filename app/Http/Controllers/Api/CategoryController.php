<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Actions\Category\CreateCategory;
use App\Actions\Category\DeleteCategory;
use App\Actions\Category\UpdateCategory;
use App\Http\Controllers\Controller;
use App\Http\Requests\Category\CreateCategoryRequest;
use App\Http\Requests\Category\ListCategoriesRequest;
use App\Http\Requests\Category\UpdateCategoryRequest;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use App\Queries\ListCategoriesQuery;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;

final class CategoryController extends Controller
{
    public function index(ListCategoriesRequest $request, ListCategoriesQuery $query): JsonResponse
    {
        $user = Auth::user();

        abort_unless($user, 403);

        return response()->json(
            CategoryResource::collect($query->handle($request, $user))->toArray()
        );
    }

    public function show(Category $category): JsonResponse
    {
        Gate::authorize('view', $category);

        return response()->json(
            CategoryResource::from($category)->toArray()
        );
    }

    public function store(CreateCategoryRequest $request, CreateCategory $action): JsonResponse
    {
        $user = Auth::user();
        abort_unless($user, 403);

        $category = $action->handle($request, $user);

        return response()->json(
            CategoryResource::from($category)->toArray(),
            201
        );
    }

    public function update(UpdateCategoryRequest $request, Category $category, UpdateCategory $action): JsonResponse
    {
        Gate::authorize('update', $category);

        $updated = $action->handle($request, $category);

        return response()->json(
            CategoryResource::from($updated)->toArray()
        );
    }

    public function destroy(Category $category, DeleteCategory $action): JsonResponse
    {
        Gate::authorize('delete', $category);

        if (! $action->handle($category)) {
            return response()->json([
                'message' => __('Failed to delete category.'),
            ], 422);
        }

        return response()->json(status: 204);
    }
}
