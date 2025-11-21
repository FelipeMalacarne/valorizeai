<?php

declare(strict_types=1);

namespace App\Actions\Import;

use App\Enums\ImportTransactionStatus;
use App\Events\Transaction\TransactionCreated;
use App\Events\Transaction\TransactionUpdated;
use App\Http\Requests\Import\ApproveImportTransactionRequest;
use App\Exceptions\Import\ImportRequiresAccountException;
use App\Exceptions\Import\ImportTransactionActionException;
use App\Models\ImportTransaction;
use App\Models\Transaction;
use App\ValueObjects\Money;
use Illuminate\Support\Facades\DB;

final class ApproveImportTransaction
{
    public function __construct(
        private readonly RefreshImportStatus $refreshImportStatus,
    ) {}

    public function handle(ImportTransaction $importTransaction, ApproveImportTransactionRequest $data): ImportTransaction
    {
        return DB::transaction(function () use ($importTransaction, $data): ImportTransaction {
            $importTransaction->refresh();

            if ($importTransaction->status === ImportTransactionStatus::APPROVED) {
                return $importTransaction;
            }

            if (! in_array($importTransaction->status, [ImportTransactionStatus::NEW, ImportTransactionStatus::CONFLICTED], true)) {
                throw ImportTransactionActionException::cannotApprove();
            }

            $import = $importTransaction->import()->lockForUpdate()->firstOrFail();

            if (! $import->account_id || ! $import->account) {
                throw new ImportRequiresAccountException();
            }

            $account = $import->account()->lockForUpdate()->firstOrFail();

            $transaction = $data->replace_existing
                ? $this->updateMatchedTransaction($importTransaction, $data)
                : $this->createNewTransaction($importTransaction, $account->id, $data);

            $importTransaction->forceFill([
                'status'         => ImportTransactionStatus::APPROVED,
                'category_id'    => $data->category_id,
                'transaction_id' => $transaction->id,
            ])->save();

            $this->refreshImportStatus->handle($import->fresh());

            return $importTransaction->fresh(['category', 'transaction', 'matchedTransaction']);
        });
    }

    private function updateMatchedTransaction(ImportTransaction $importTransaction, ApproveImportTransactionRequest $data): Transaction
    {
        if (! $importTransaction->matched_transaction_id) {
            throw ImportTransactionActionException::missingMatchedTransaction();
        }

        /** @var Transaction $transaction */
        $transaction = $importTransaction->matchedTransaction()->lockForUpdate()->firstOrFail();
        $oldTransaction = $transaction->replicate();

        $transaction->fill([
            'memo'        => $importTransaction->memo,
            'fitid'       => $importTransaction->fitid,
            'date'        => $importTransaction->date,
            'type'        => $importTransaction->type,
            'currency'    => $importTransaction->currency,
            'amount'      => new Money($importTransaction->amount->value, $importTransaction->currency),
            'category_id' => $data->category_id,
        ]);
        $transaction->save();

        TransactionUpdated::dispatch($oldTransaction, $transaction);

        return $transaction;
    }

    private function createNewTransaction(ImportTransaction $importTransaction, string $accountId, ApproveImportTransactionRequest $data): Transaction
    {
        $transaction = Transaction::create([
            'account_id'  => $accountId,
            'fitid'       => $importTransaction->fitid,
            'memo'        => $importTransaction->memo,
            'date'        => $importTransaction->date,
            'type'        => $importTransaction->type,
            'currency'    => $importTransaction->currency,
            'amount'      => new Money($importTransaction->amount->value, $importTransaction->currency),
            'category_id' => $data->category_id,
        ]);

        TransactionCreated::dispatch($transaction);

        return $transaction;
    }
}
