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
        Schema::table('transactions', function (Blueprint $table) {
            $table->index(
                ['account_id', 'date'],
                'transactions_account_id_date_index'
            );

            $table->index(
                ['category_id', 'date'],
                'transactions_category_id_date_index'
            );
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->dropIndex('transactions_account_id_date_index');
            $table->dropIndex('transactions_category_id_date_index');
        });
    }
};
