<?php

declare(strict_types=1);

namespace App\Actions\Import;

use App\Enums\ImportTransactionStatus;
use App\Exceptions\Import\ImportTransactionActionException;
use App\Http\Requests\Import\ApproveImportTransactionRequest;
use App\Models\Import;
use App\Models\ImportTransaction;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

final class BulkApproveImportTransactions
{
    public function __construct(
        private readonly ApproveImportTransaction $approveImportTransaction,
    ) {}

    /**
     * @param  Collection<int, ImportTransaction>  $transactions
     */
    public function handle(Import $import, Collection $transactions, ?string $categoryId): void
    {
        if ($transactions->isEmpty()) {
            return;
        }

        $invalid = $transactions->first(fn (ImportTransaction $transaction) => $transaction->status !== ImportTransactionStatus::NEW);

        if ($invalid) {
            throw ImportTransactionActionException::bulkOnlyNew();
        }

        DB::transaction(function () use ($transactions, $categoryId): void {
            $transactions->each(function (ImportTransaction $transaction) use ($categoryId): void {
                $this->approveImportTransaction->handle(
                    $transaction,
                    new ApproveImportTransactionRequest(
                        category_id: $categoryId,
                        replace_existing: false,
                    )
                );
            });
        });
    }
}
