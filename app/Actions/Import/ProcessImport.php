<?php

declare(strict_types=1);

namespace App\Actions\Import;

use App\Enums\ImportStatus;
use App\Enums\ImportTransactionStatus;
use App\Events\Account\BulkTransactionsAdded;
use App\Models\Account;
use App\Models\Bank;
use App\Models\Import;
use App\Models\Transaction;
use App\Notifications\ImportCompletedNotification;
use App\Services\Statement\Parsers\OfxParser;
use App\ValueObjects\Money;
use Illuminate\Broadcasting\BroadcastException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

final class ProcessImport
{
    public function __construct(
        private readonly OfxParser $ofxParser,
    ) {}

    public function handle(Import $import): Import
    {
        Log::withContext(['import_id' => $import->id]);
        Log::info('Starting import processing');

        $ofxContent = Storage::get($import->file_path);

        $statement = $this->ofxParser->parse($ofxContent);

        return DB::transaction(function () use ($statement, $import) {
            $bank = Bank::firstOrCreate(
                ['code' => $statement->bankAccount->bankId],
                ['name' => $statement->bankAccount->bankName]
            );

            /** @var Account $account */
            $account = Account::firstOrCreate([
                'type'    => $statement->bankAccount->type,
                'number'  => $statement->bankAccount->number,
                'bank_id' => $bank->id,
                'user_id' => $import->user_id,
            ], [
                'currency' => $statement->currency,
                'name'     => $statement->bankAccount->bankName,
            ]);

            Log::withContext(['account_id' => $account->id]);

            $statusCounters = [
                ImportTransactionStatus::NEW->value        => 0,
                ImportTransactionStatus::MATCHED->value    => 0,
                ImportTransactionStatus::CONFLICTED->value => 0,
            ];

            $matchedTransactions = $account->transactions()
                ->whereIn('fitid', $statement->transactions->pluck('fitid')->filter())
                ->get()
                ->keyBy('fitid');

            $pendingTransactions = $statement->transactions->map(function ($transaction) use ($matchedTransactions, &$statusCounters, $import) {
                $status = ImportTransactionStatus::NEW;
                $matchedId = null;

                if ($matchedTransactions->has($transaction->fitid)) {
                    $existingTransaction = $matchedTransactions->get($transaction->fitid);
                    $matchedId = $existingTransaction->id;

                    if (
                        $existingTransaction->amount->equals($transaction->amount) &&
                        $existingTransaction->date->isSameDay($transaction->date)
                    ) {
                        $status = ImportTransactionStatus::MATCHED;
                        Log::debug('Transaction matched', ['fitid' => $transaction->fitid]);
                    } else {
                        $status = ImportTransactionStatus::CONFLICTED;
                        Log::debug('Transaction conflicted', ['fitid' => $transaction->fitid]);
                    }
                }

                $statusCounters[$status->value]++;

                return [
                    'import_id'              => $import->id,
                    'fitid'                  => $transaction->fitid,
                    'date'                   => $transaction->date,
                    'amount'                 => $transaction->amount->value,
                    'currency'               => $transaction->amount->currency,
                    'memo'                   => $transaction->memo,
                    'type'                   => $transaction->type,
                    'status'                 => $status,
                    'matched_transaction_id' => $matchedId,
                ];
            });

            $import->importTransactions()->createMany($pendingTransactions);

            $import->forceFill([
                'status'           => ImportStatus::COMPLETED,
                'new_count'        => $statusCounters[ImportTransactionStatus::NEW->value],
                'matched_count'    => $statusCounters[ImportTransactionStatus::MATCHED->value],
                'conflicted_count' => $statusCounters[ImportTransactionStatus::CONFLICTED->value],
            ])->save();

            Log::info('Import processing completed', [
                'new_count'        => $import->new_count,
                'matched_count'    => $import->matched_count,
                'conflicted_count' => $import->conflicted_count,
            ]);

            $transactionsToCreate = collect($pendingTransactions)->where('status', ImportTransactionStatus::NEW)->map(function ($item) use ($account) {
                return [
                    'fitid'      => $item['fitid'],
                    'date'       => $item['date'],
                    'amount'     => $item['amount'],
                    'currency'   => $item['currency'],
                    'memo'       => $item['memo'],
                    'type'       => $item['type'],
                    'account_id' => $account->id,
                ];
            })->values();

            $transactions = $account->transactions()->createMany($transactionsToCreate);

            $balanceToAdd = $transactions->reduce(function (Money $carry, Transaction $transaction) {
                return $carry->add($transaction->amount);
            }, Money::from(0, $account->currency));

            BulkTransactionsAdded::dispatch((string) $account->id, $balanceToAdd);

            Log::info('New transactions created', [
                'count'         => $transactionsToCreate->count(),
                'balance_added' => $balanceToAdd->format(),
            ]);

            try {
                $import->user?->notify(new ImportCompletedNotification($import, $account));
            } catch (BroadcastException $exception) {
                Log::warning('Failed to broadcast import notification', [
                    'import_id' => $import->id,
                    'exception' => $exception->getMessage(),
                ]);
            }

            return $import;
        });
    }
}
