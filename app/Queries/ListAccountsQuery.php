<?php

declare(strict_types=1);

namespace App\Queries;

use App\Http\Requests\IndexAccountsRequest;
use App\Models\User;
use Illuminate\Pagination\LengthAwarePaginator;

final class ListAccountsQuery
{
    public function handle(IndexAccountsRequest $data, User $user): LengthAwarePaginator
    {
        $query = $user->accounts()->with(['bank']);

        if ($data->search) {
            $query->where(function ($query) use ($data) {
                $query->where('name', 'like', "%{$data->search}%")
                    ->orWhere('number', 'like', "%{$data->search}%");
            });
        }

        if ($data->type) {
            $query->where('type', $data->type);
        }

        if ($data->currency) {
            $query->where('currency', $data->currency);
        }

        return $query->paginate(10)->withQueryString();

    }
}
