<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Actions\Category\EnsureDefaultCategoriesForUser;
use App\Enums\Color;
use App\Models\Category;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

final class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::transaction(function () {
            Category::firstOrCreate(
                [
                    'name'    => Category::SPLIT_CATEGORY_NAME,
                    'user_id' => null,
                ],
                [
                    'description' => 'System category used for split transactions.',
                    'color'       => Color::MAROON,
                    'is_default'  => true,
                ]
            );
        });

        $ensureDefaults = app(EnsureDefaultCategoriesForUser::class);
        User::query()->each(fn (User $user) => $ensureDefaults->handle($user));
    }
}
