<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Enums\Color;
use App\Models\Category;
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
            $defaultCategories = [
                [
                    'name'        => 'Food & Dining',
                    'description' => 'Restaurants, groceries, and dining expenses',
                    'color'       => Color::RED,
                    'is_default'  => true,
                ],
                [
                    'name'        => 'Transportation',
                    'description' => 'Gas, public transport, car maintenance',
                    'color'       => Color::BLUE,
                    'is_default'  => true,
                ],
                [
                    'name'        => 'Shopping',
                    'description' => 'Clothing, electronics, and general purchases',
                    'color'       => Color::MAUVE,
                    'is_default'  => true,
                ],
                [
                    'name'        => 'Entertainment',
                    'description' => 'Movies, games, hobbies, and leisure activities',
                    'color'       => Color::PINK,
                    'is_default'  => true,
                ],
                [
                    'name'        => 'Bills & Utilities',
                    'description' => 'Electricity, water, internet, phone bills',
                    'color'       => Color::PEACH,
                    'is_default'  => true,
                ],
                [
                    'name'        => 'Healthcare',
                    'description' => 'Medical expenses, pharmacy, insurance',
                    'color'       => Color::GREEN,
                    'is_default'  => true,
                ],
                [
                    'name'        => 'Education',
                    'description' => 'Books, courses, training, and learning',
                    'color'       => Color::SAPPHIRE,
                    'is_default'  => true,
                ],
                [
                    'name'        => 'Travel',
                    'description' => 'Vacations, hotels, and travel expenses',
                    'color'       => Color::TEAL,
                    'is_default'  => true,
                ],
                [
                    'name'        => 'Income',
                    'description' => 'Salary, freelance, and other income sources',
                    'color'       => Color::SKY,
                    'is_default'  => true,
                ],
                [
                    'name'        => 'Savings',
                    'description' => 'Emergency fund, investments, and savings',
                    'color'       => Color::LAVENDER,
                    'is_default'  => true,
                ],
            ];

            foreach ($defaultCategories as $categoryData) {
                Category::firstOrCreate(
                    [
                        'name'    => $categoryData['name'],
                        'user_id' => null, // Default categories have no user_id
                    ],
                    $categoryData
                );
            }
        });

    }
}
