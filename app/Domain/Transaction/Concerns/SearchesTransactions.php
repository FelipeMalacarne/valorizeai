<?php

declare(strict_types=1);

namespace App\Domain\Transaction\Concerns;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Laravel\Scout\Searchable;

trait SearchesTransactions
{
    use Searchable;

    /**
     * @return array<string,string>
     */
    public function mappableAs(): array
    {
        return [
            'id'             => 'keyword',
            'fitid'          => 'keyword',
            'account_id'     => 'keyword',
            'account_number' => 'keyword',
            'currency'       => 'keyword',
            'amount'         => 'integer',
            'memo'           => 'search_as_you_type',
            'description'    => 'search_as_you_type',
            'date_posted'    => 'date',
            'created_at'     => 'date',
            'updated_at'     => 'date',
            'user_id'        => 'keyword',
            'categories'     => 'keyword',
        ];
    }

    /**
     * @return array<string,mixed>
     */
    public function toSearchableArray(): array
    {
        return [
            'id'             => $this->id,
            'fitid'          => $this->fitid,
            'account_id'     => $this->account_id,
            'account_number' => $this->account_number,
            'currency'       => $this->currency,
            'amount'         => $this->amount,
            'memo'           => $this->memo,
            'description'    => $this->description,
            'date_posted'    => $this->date_posted,
            'created_at'     => $this->created_at,
            'updated_at'     => $this->updated_at,
            'user_id'        => $this->account->user_id,
            'categories'     => $this->categories?->pluck('id')->toArray(),
        ];
    }

    /**
     * @param  Builder<Model>  $query
     */
    protected function makeAllSearchableUsing(Builder $query): Builder
    {
        return $query->with(['account', 'categories']);
    }
}
