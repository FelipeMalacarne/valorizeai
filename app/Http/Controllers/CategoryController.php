<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\Category\CreateCategory;
use App\Actions\Category\DeleteCategory;
use App\Actions\Category\UpdateCategory;
use App\Enums\Color;
use App\Http\Requests\Category\CreateCategoryRequest;
use App\Http\Requests\Category\ListCategoriesRequest;
use App\Http\Requests\Category\UpdateCategoryRequest;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use App\Queries\Category\CategoryInsightsQuery;
use App\Queries\ListCategoriesQuery;
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

        return Inertia::render('categories/index', [
            'categories'       => CategoryResource::collect($categories),
            'available_colors' => collect(Color::cases())->map(fn (Color $color) => [
                'value' => $color->value,
                'label' => ucfirst(str_replace('_', ' ', $color->name)),
            ]),
        ]);
    }

    public function store(CreateCategoryRequest $request, CreateCategory $action): RedirectResponse
    {
        $category = $action->handle($request, Auth::user());

        return redirect()
            ->route('categories.index')
            ->with('success', __('Categoria :name criada com sucesso.', ['name' => $category->name]));
    }

    public function show(Category $category, CategoryInsightsQuery $insights): InertiaResponse
    {
        Gate::authorize('view', $category);

        $user = Auth::user();

        if (! $user) {
            abort(403);
        }

        $availableColors = collect(Color::cases())->map(fn (Color $color) => [
            'value' => $color->value,
            'label' => ucfirst(str_replace('_', ' ', $color->name)),
        ]);

        $usedColors = Category::ownedBy($user->id)->pluck('color')->all();

        return Inertia::render('categories/show', [
            'category' => CategoryResource::from($category),
            'available_colors' => $availableColors,
            'used_colors' => $usedColors,
            'insights' => $insights->resource($category, $user),
        ]);
    }

    public function update(UpdateCategoryRequest $request, Category $category, UpdateCategory $action): RedirectResponse
    {
        Gate::authorize('update', $category);

        $updatedCategory = $action->handle($request, $category);

        return redirect()
            ->back()
            ->with('success', __('Categoria :name atualizada com sucesso.', ['name' => $updatedCategory->name]));
    }

    public function destroy(Category $category, DeleteCategory $action): RedirectResponse
    {
        Gate::authorize('delete', $category);

        $action->handle($category);

        return redirect()
            ->route('categories.index')
            ->with('success', __('Categoria :name removida com sucesso.', ['name' => $category->name]));
    }
}
