<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('budget_allocations', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('budget_id')->constrained()->cascadeOnDelete();
            $table->date('month');
            $table->integer('budgeted_amount');
            $table->timestamps();

            $table->unique(['budget_id', 'month']);
            $table->index('month');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('budget_allocations');
    }
};
