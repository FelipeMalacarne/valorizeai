<?php

declare(strict_types=1);

namespace App\Queries\Import;

use App\Http\Requests\Import\ImportTransactionIndexRequest;
use App\Http\Resources\ImportTransactionResource;
use App\Models\Import;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

final class ListImportTransactionsQuery
{
    public function handle(ImportTransactionIndexRequest $args, Import $import): LengthAwarePaginator
    {
        $query = $import->importTransactions()
            ->with([
                'category',
                'matchedTransaction.category',
            ]);

        if ($args->status) {
            $query->where('status', $args->status);
        }

        if ($args->type) {
            $query->where('type', $args->type);
        }

        if ($args->search) {
            $query->where(function ($builder) use ($args): void {
                $builder->where('memo', 'ilike', '%'.$args->search.'%')
                    ->orWhere('fitid', 'ilike', '%'.$args->search.'%');
            });
        }

        $query->orderByDesc('date');

        return $query->paginate($args->per_page, ['*'], 'page', $args->page)->withQueryString();
    }

    public function resource(ImportTransactionIndexRequest $args, Import $import): LengthAwarePaginator
    {
        return ImportTransactionResource::collect($this->handle($args, $import));
    }
}
