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
use App\Http\Resources\BankResource;
use App\Http\Resources\TransactionResource;
use App\Models\Account;
use App\Models\Bank;
use App\Queries\Account\UserAccountsQuery;
use App\Queries\Bank\BanksQuery;
use App\Queries\Category\UserCategoriesQuery;
use App\Queries\Account\SpendingByCategoryQuery;
use App\Queries\ListAccountsQuery;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

final class AccountController extends Controller
{
    public function index(
        IndexAccountsRequest $data,
        ListAccountsQuery $query,
        BanksQuery $banks,
    ): Response {
        return Inertia::render('accounts/index', [
            'accounts' => fn () => $query->resource($data, Auth::user()),
            'banks'    => fn () => $banks->resource(),
        ]);
    }

    public function create(): Response
    {
        $banks = Cache::remember('banks', now()->addDays(), fn () => Bank::all());

        return Inertia::render('accounts/create', [
            'banks' => BankResource::collect($banks),
        ]);
    }

    public function store(StoreAccountRequest $data, StoreAccount $action): RedirectResponse
    {
        $account = $action->handle($data, Auth::user());

        return to_route('accounts.index')->with([
            'success' => __('Account :name created successfully', ['name' => $account->name]),
        ]);
    }

    public function show(
        Account $account,
        UserCategoriesQuery $categories,
        UserAccountsQuery $accounts,
        BanksQuery $banks,
        SpendingByCategoryQuery $spendingByCategory
    ): Response {
        Gate::authorize('view', $account);

        $recentTransactions = $account->transactions()
            ->orderBy('date', 'desc')
            ->with(['account.bank', 'category'])
            ->limit(5)
            ->get();

        return Inertia::render('accounts/show', [
            'account'             => fn () => AccountResource::from($account->load(['bank'])),
            'recent_transactions' => fn () => TransactionResource::collect($recentTransactions),
            'spending_summary'    => fn () => $spendingByCategory->handle($account),
            'banks'               => fn () => $banks->resource(),
            'all_accounts'        => fn () => $accounts->resource(Auth::user()->id),
            'categories'          => fn () => $categories->resource(Auth::user()->id),
        ]);
    }

    public function update(UpdateAccountRequest $data, UpdateAccount $action, Account $account): RedirectResponse
    {
        Gate::authorize('update', $account);

        $account = $action->handle($data, $account);

        return to_route('accounts.index')->with([
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

        return to_route('accounts.index')->with([
            'success' => __('Account :name deleted successfully', ['name' => $account->name]),
        ]);

    }
}
