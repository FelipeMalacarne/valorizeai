<?php

declare(strict_types=1);

namespace App\Actions\Import;

use App\Enums\ImportTransactionStatus;
use App\Exceptions\Import\ImportTransactionActionException;
use App\Models\ImportTransaction;
use Illuminate\Support\Facades\DB;

final class RejectImportTransaction
{
    public function __construct(
        private readonly RefreshImportStatus $refreshImportStatus,
    ) {}

    public function handle(ImportTransaction $importTransaction): ImportTransaction
    {
        return DB::transaction(function () use ($importTransaction): ImportTransaction {
            $importTransaction->refresh();

            if ($importTransaction->status === ImportTransactionStatus::REJECTED) {
                return $importTransaction;
            }

            if (! in_array($importTransaction->status, [ImportTransactionStatus::NEW, ImportTransactionStatus::CONFLICTED], true)) {
                throw ImportTransactionActionException::cannotReject();
            }

            $importTransaction->forceFill([
                'status'      => ImportTransactionStatus::REJECTED,
                'category_id' => null,
            ])->save();

            $this->refreshImportStatus->handle($importTransaction->import->fresh());

            return $importTransaction;
        });
    }
}
