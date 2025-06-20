<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\Category\CreateCategory;
use App\Actions\Category\DeleteCategory;
use App\Actions\Category\UpdateCategory;
use App\Http\Requests\Category\CreateCategoryRequest;
use App\Http\Requests\Category\ListCategoriesRequest;
use App\Http\Requests\Category\UpdateCategoryRequest;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use App\Queries\ListCategoriesQuery;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

final class CategoryController extends Controller
{
    public function index(ListCategoriesRequest $request, ListCategoriesQuery $query): InertiaResponse
    {
        $categories = $query->handle($request, Auth::user());

        return Inertia::render('Categories/Index', [
            'categories' => CategoryResource::collect($categories),
        ]);
    }

    public function store(CreateCategoryRequest $request, CreateCategory $action): RedirectResponse
    {
        $category = $action->handle($request, Auth::user());

        return redirect()->back([
            'success' => __('Category :name created successfully', ['name' => $category->name]),
        ]);
    }

    public function show(Category $category): JsonResponse
    {
        Gate::authorize('view', $category);

        return response()->json([
            'category' => CategoryResource::from($category),
        ]);
    }

    public function update(UpdateCategoryRequest $request, Category $category, UpdateCategory $action): RedirectResponse
    {
        Gate::authorize('update', $category);

        $updatedCategory = $action->handle($request, $category);

        return redirect()->back([
            'success' => __('Category :name updated successfully', ['name' => $updatedCategory->name]),
        ]);
    }

    public function destroy(Category $category, DeleteCategory $action): RedirectResponse
    {
        Gate::authorize('delete', $category);

        $action->handle($category);

        return redirect()->back([
            'success' => __('Category :name deleted successfully', ['name' => $category->name]),
        ]);
    }
}
