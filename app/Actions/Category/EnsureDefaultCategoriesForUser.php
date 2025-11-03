<?php

declare(strict_types=1);

namespace App\Actions\Category;

use App\Models\Category;
use App\Models\User;
use App\Support\DefaultCategories;
use Illuminate\Support\Facades\DB;

final class EnsureDefaultCategoriesForUser
{
    public function handle(User $user): void
    {
        DB::transaction(function () use ($user) {
            $existingColors = $user->categories()->pluck('color')->all();

            foreach (DefaultCategories::presets() as $preset) {
                if (in_array($preset['color']->value, $existingColors, true)) {
                    continue;
                }

                Category::create([
                    'name'        => $preset['name'],
                    'description' => $preset['description'],
                    'color'       => $preset['color'],
                    'is_default'  => true,
                    'user_id'     => $user->id,
                ]);
            }
        });
    }
}
