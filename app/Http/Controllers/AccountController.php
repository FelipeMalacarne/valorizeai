<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\IndexAccountsRequest;
use App\Http\Requests\StoreAccountRequest;
use App\Http\Resources\AccountResource;
use App\Models\Account;
use App\Queries\ListAccountsQuery;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

final class AccountController extends Controller
{
    public function index(IndexAccountsRequest $data, ListAccountsQuery $query)
    {
        $accounts = $query->handle($data, Auth::user());

        return Inertia::render('accounts/index', [
            'accounts' => AccountResource::collect($accounts),
        ]);
    }

    public function store(StoreAccountRequest $data) {}

    public function show(Account $account) {}

    public function update(StoreAccountRequest $data, Account $account)
    {
        // Logic to update the account
        // This could involve validating the request data and updating the account in the database.

        return response()->json(['message' => 'Account updated successfully']);
    }

    public function destroy() {}
}
