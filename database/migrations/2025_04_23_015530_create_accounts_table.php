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
        Schema::create('banks', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->string('code', 3)->unique();
            $table->string('website')->nullable();
            $table->timestamps();
        });

        Schema::create('accounts', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->integer('balance')->default(0); // cents
            $table->enum('currency', ['BRL', 'USD', 'EUR']);
            $table->enum('type', ['checking', 'savings', 'credit', 'investment']);
            $table->string('number', 16)->nullable();
            $table->foreignUuid('user_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('bank_id')->constrained()->nullOnDelete();
            $table->timestamps();

            $table->index(['user_id']);
            $table->index(['bank_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('accounts');
    }
};
