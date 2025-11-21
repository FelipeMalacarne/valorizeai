<?php

declare(strict_types=1);

namespace App\Queries\Import;

use App\Enums\ImportTransactionStatus;
use App\Http\Requests\Import\IndexImportRequest;
use App\Http\Resources\ImportResource;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

final class IndexImportsQuery
{
    public function handle(IndexImportRequest $args, User $user): LengthAwarePaginator
    {
        $query = $user->imports()
            ->with(['account.bank'])
            ->withCount([
                'importTransactions as pending_transactions' => fn ($query) => $query->whereIn('status', [
                    ImportTransactionStatus::NEW,
                    ImportTransactionStatus::CONFLICTED,
                ]),
                'importTransactions as approved_transactions' => fn ($query) => $query->where('status', ImportTransactionStatus::APPROVED),
                'importTransactions as rejected_transactions' => fn ($query) => $query->where('status', ImportTransactionStatus::REJECTED),
            ]);

        if ($args->status) {
            $query->where('status', $args->status);
        }

        if ($args->search) {
            $query->where(function ($builder) use ($args): void {
                $builder->where('file_name', 'ilike', '%'.$args->search.'%')
                    ->orWhereHas('account', fn ($accountQuery) => $accountQuery->where('name', 'ilike', '%'.$args->search.'%'));
            });
        }

        $query->orderByDesc('created_at');

        return $query->paginate($args->per_page, ['*'], 'page', $args->page)->withQueryString();
    }

    public function resource(IndexImportRequest $args, User $user): LengthAwarePaginator
    {
        return ImportResource::collect($this->handle($args, $user));
    }
}
