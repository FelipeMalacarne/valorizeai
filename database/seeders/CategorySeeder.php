<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('categories')->insert([
            [
                'id'         => Str::uuid7(),
                'name'       => 'food',
                'color'      => 'red',
                'is_default' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id'         => Str::uuid7(),
                'name'       => 'transport',
                'color'      => 'yellow',
                'is_default' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id'         => Str::uuid7(),
                'name'       => 'healthcare',
                'color'      => 'green',
                'is_default' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id'         => Str::uuid7(),
                'name'       => 'leisure',
                'color'      => 'blue',
                'is_default' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id'         => Str::uuid7(),
                'name'       => 'education',
                'color'      => 'lavender',
                'is_default' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id'         => Str::uuid7(),
                'name'       => 'housing',
                'color'      => 'peach',
                'is_default' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id'         => Str::uuid7(),
                'name'       => 'clothing',
                'color'      => 'sapphire',
                'is_default' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
