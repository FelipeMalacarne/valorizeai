<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\Account\DestroyAccount;
use App\Actions\Account\StoreAccount;
use App\Actions\Account\UpdateAccount;
use App\Http\Requests\Account\IndexAccountsRequest;
use App\Http\Requests\Account\StoreAccountRequest;
use App\Http\Requests\Account\UpdateAccountRequest;
use App\Http\Resources\AccountResource;
use App\Models\Account;
use App\Queries\ListAccountsQuery;
use Illuminate\Http\RedirectResponse;
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

    public function update(UpdateAccountRequest $data, UpdateAccount $action, Account $account): RedirectResponse
    {
        Gate::authorize('update', $account);

        $account = $action->handle($data, $account);

        return back()->with([
            'success' => __('Account :name updated successfully', ['name' => $account->name]),
        ]);
    }

    public function destroy(Account $account, DestroyAccount $action): RedirectResponse
    {
        Gate::authorize('delete', $account);

        if (! $action->handle($account)) {
            return back()->with([
                'error' => __('Failed to delete account :name', ['name' => $account->name]),
            ]);
        }

        return back()->with([
            'success' => __('Account :name deleted successfully', ['name' => $account->name]),
        ]);

    }
}
