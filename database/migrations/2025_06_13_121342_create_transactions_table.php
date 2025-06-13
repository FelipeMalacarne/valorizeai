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
        Schema::create('transactions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('fitid')->nullable();
            $table->string('memo')->nullable();
            $table->enum('currency', ['BRL', 'USD', 'EUR']);
            $table->integer('amount');
            $table->enum('type', ['debit', 'credit']);
            $table->dateTime('date');
            $table->foreignUuid('account_id')->constrained('accounts')->cascadeOnDelete();
            $table->foreignUuid('category_id')->nullable()->constrained('categories')->nullOnDelete();
            $table->timestamps();

            $table->index(['account_id']);
            $table->index(['category_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
