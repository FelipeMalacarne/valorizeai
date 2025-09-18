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
        Schema::create('imports', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('file_name');
            $table->enum('extension', ['ofx', 'csv']);
            $table->enum('status', ['processing', 'pending_review', 'approved', 'refused', 'completed', 'failed']);
            $table->integer('new_count')->default(0);
            $table->integer('matched_count')->default(0);
            $table->integer('conflicted_count')->default(0);
            $table->timestamps();
        });

        Schema::create('import_transactions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('import_id')->constrained('imports')->cascadeOnDelete();
            $table->foreignUuid('matched_transaction_id')->nullable()->constrained('transactions')->nullOnDelete();
            $table->foreignUuid('category_id')->nullable()->constrained('categories')->nullOnDelete();

            $table->enum('status', ['pending', 'matched', 'conflicted', 'refused', 'new', 'approved', 'rejected']);

            $table->string('fitid')->nullable()->index();
            $table->string('memo');
            $table->enum('currency', ['BRL', 'USD', 'EUR']);
            $table->integer('amount');

            $table->dateTime('date');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('import_transactions');
        Schema::dropIfExists('imports');
    }
};
