<?php

declare(strict_types=1);

namespace App\Queries\Account;

use App\Enums\TransactionType;
use App\Models\Account;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

final class SpendingByCategoryQuery
{
    public function handle(Account $account)
    {
        return $account->transactions()
            ->select([
                'categories.name as category_name',
                'categories.color as category_color',
                DB::raw('SUM(transactions.amount) as total_amount'),
            ])
            ->join('categories', 'transactions.category_id', '=', 'categories.id')
            ->where('transactions.type', TransactionType::DEBIT)
            ->whereBetween('transactions.date', [Carbon::now()->startOfMonth(), Carbon::now()->endOfMonth()])
            ->groupBy('transactions.category_id', 'categories.name', 'categories.color')
            ->orderBy('total_amount', 'desc')
            ->get()
            ->map(function ($item) {
                $totalAmount = abs($item->total_amount);

                return [
                    'category' => $item->category_name,
                    'amount' => $totalAmount / 100,
                    'color' => $item->category_color,
                ];
            });
    }
}
