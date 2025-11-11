<?php

declare(strict_types=1);

namespace App\Actions\Import;

use App\Enums\ImportStatus;
use App\Enums\ImportTransactionStatus;
use App\Models\Import;
use Illuminate\Support\Facades\DB;

final class RefreshImportStatus
{
    public function handle(Import $import): void
    {
        $counters = $import->importTransactions()
            ->select('status', DB::raw('count(*) as aggregate'))
            ->groupBy('status')
            ->pluck('aggregate', 'status');

        $newCount = (int) ($counters[ImportTransactionStatus::NEW->value] ?? 0);
        $conflictedCount = (int) ($counters[ImportTransactionStatus::CONFLICTED->value] ?? 0);
        $matchedCount = (int) ($counters[ImportTransactionStatus::MATCHED->value] ?? 0);

        $hasPending = ($newCount + $conflictedCount) > 0;
        $newStatus = $hasPending ? ImportStatus::PENDING_REVIEW : ImportStatus::COMPLETED;

        $import->forceFill([
            'status'           => $newStatus,
            'new_count'        => $newCount,
            'conflicted_count' => $conflictedCount,
            'matched_count'    => $matchedCount,
        ])->save();
    }
}
