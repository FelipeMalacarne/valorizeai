<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Resources\BankResource;
use App\Models\Bank;
use Illuminate\Support\Facades\Cache;

final class BankController extends Controller
{
    public function index()
    {
        $banks = Cache::remember('banks', now()->addDays(), fn () => Bank::all());

        return BankResource::collect($banks);
    }
}
