<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('imports', function (Blueprint $table): void {
            $table->foreignUuid('account_id')->nullable()->after('user_id')->constrained()->nullOnDelete();
        });

        Schema::table('import_transactions', function (Blueprint $table): void {
            $table->foreignUuid('transaction_id')->nullable()->after('matched_transaction_id')->constrained('transactions')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('import_transactions', function (Blueprint $table): void {
            $table->dropConstrainedForeignId('transaction_id');
        });

        Schema::table('imports', function (Blueprint $table): void {
            $table->dropConstrainedForeignId('account_id');
        });
    }
};
