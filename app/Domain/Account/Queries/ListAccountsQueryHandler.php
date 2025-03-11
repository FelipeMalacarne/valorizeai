<?php

declare(strict_types=1);

namespace App\Domain\Account\Queries;

use App\Domain\Account\Projections\Account;
use App\Support\CQRS\QueryHandler;
use Illuminate\Support\Collection;

final class ListAccountsQueryHandler implements QueryHandler
{
    /**
     * @return Collection<int,Account>
     */
    public function handle(ListAccountsQuery $query): Collection
    {
        return Account::search()
            ->where('user_id', $query->userId)
            ->orderByDesc('created_at')
            ->get();
    }
}
