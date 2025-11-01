<?php

declare(strict_types=1);

namespace App\Queries\Bank;

use App\Http\Resources\BankResource;
use App\Models\Bank;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;

class BanksQuery
{
    public function handle()
    {
        return Cache::remember('banks', now()->addDays(), fn () => Bank::all());
    }

    /** @return Collection<int, AccountResource> */
    public function resource(): Collection
    {
        return BankResource::collect($this->handle());
    }
}
