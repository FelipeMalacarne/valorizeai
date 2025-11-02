<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('categories', function (Blueprint $table) {
            $table->dropUnique('unique_category_name_per_user');
        });

        DB::statement('CREATE UNIQUE INDEX categories_user_color_unique ON categories (user_id, color) WHERE user_id IS NOT NULL');
    }

    public function down(): void
    {
        DB::statement('DROP INDEX IF EXISTS categories_user_color_unique');

        Schema::table('categories', function (Blueprint $table) {
            $table->unique(['name', 'user_id'], 'unique_category_name_per_user');
        });
    }
};
