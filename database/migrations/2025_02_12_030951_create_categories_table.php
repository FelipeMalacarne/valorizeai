<?php

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
        Schema::create('categories', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->boolean('is_default')->default(false);
            $table->string('color', 20);
            $table->uuid('user_id')->nullable();
            $table->timestamps();

            $table->unique(['name', 'user_id']);

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });

        Schema::create('category_transaction', function (Blueprint $table) {
            $table->foreignUuid('category_id')->constrained()->onDelete('cascade');
            $table->foreignUuid('transaction_id')->constrained()->onDelete('cascade');
            $table->primary(['category_id', 'transaction_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('category_transaction');
        Schema::dropIfExists('categories');
    }
};
