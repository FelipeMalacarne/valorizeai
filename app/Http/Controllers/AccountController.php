<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\Account\StoreAccount;
use App\Http\Requests\Account\IndexAccountsRequest;
use App\Http\Requests\Account\StoreAccountRequest;
use App\Http\Resources\AccountResource;
use App\Models\Account;
use App\Queries\ListAccountsQuery;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

final class AccountController extends Controller
{
    public function index(IndexAccountsRequest $data, ListAccountsQuery $query): Response
    {
        $accounts = $query->handle($data, Auth::user());

        return Inertia::render('accounts/index', [
            'accounts' => AccountResource::collect($accounts),
        ]);
    }

    public function store(StoreAccountRequest $data, StoreAccount $action): RedirectResponse
    {
        $account = $action->handle($data, Auth::user());

        return back()->with([
            'success' => __('Account :name created successfully', ['name' => $account->name]),
        ]);
    }

    public function show(Account $account): Response
    {
        Gate::authorize('view', $account);

        return Inertia::render('accounts/show', [
            'account' => AccountResource::from($account->load(['bank'])),
        ]);
    }

    public function update(StoreAccountRequest $data, Account $account): RedirectResponse
    {
        Gate::authorize('update', $account);
        // Logic to update the account
        // This could involve validating the request data and updating the account in the database.

        return back()->with([
            'success' => __('Account :name updated successfully', ['name' => $account->name]),
        ]);
    }

    public function destroy(Account $account): RedirectResponse
    {
        Gate::authorize('delete', $account);

        return back()->with([
            'success' => __('Account :name deleted successfully', ['name' => $account->name]),
        ]);

    }
}
