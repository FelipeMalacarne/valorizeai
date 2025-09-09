<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\Transaction\DestroyTransaction;
use App\Actions\Transaction\StoreTransaction;
use App\Actions\Transaction\UpdateTransaction;
use App\Http\Requests\Transaction\StoreTransactionRequest;
use App\Http\Requests\Transaction\UpdateTransactionRequest;
use App\Http\Resources\AccountResource;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\TransactionResource;
use App\Models\Category;
use App\Models\Transaction;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

final class TransactionController extends Controller
{
    public function index()
    {
        $transactions = Auth::user()
            ->transactions()
            ->latest()
            ->paginate()
            ->withQueryString();

        $transactions->load([
            'splits.category',
            'category',
            'account.bank',
        ]);

        return Inertia::render('transactions/index', [
            'transactions' => TransactionResource::collect($transactions),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        $user = Auth::user();

        $accounts = $user->accounts()->get()->load(['bank']);
        $categories = Category::whereUser($user->id)->get();
        $recentTransactions = $user->transactions()->with(['account.bank', 'category'])->latest()->limit(5)->get();

        return Inertia::render('transactions/create', [
            'accounts'            => AccountResource::collect($accounts),
            'categories'          => CategoryResource::collect($categories),
            'recent_transactions' => TransactionResource::collect($recentTransactions),
        ]);
    }

    public function store(StoreTransactionRequest $request, StoreTransaction $action): RedirectResponse
    {
        $action->handle($request);

        return redirect()->route('transactions.index')->with([
            'success' => __('Transaction created successfully'),
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Transaction $transaction)
    {
        Gate::authorize('view', $transaction);

        $transaction->load(['splits.category', 'category', 'account.bank']);

        return Inertia::render('transactions/show', [
            'transaction' => TransactionResource::from($transaction),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Transaction $transaction)
    {
        //
    }

    public function update(UpdateTransactionRequest $request, Transaction $transaction, UpdateTransaction $action): RedirectResponse
    {
        Gate::authorize('update', $transaction);

        $action->handle($request, $transaction);

        return redirect()->route('transactions.index')->with(['success' => __('Transaction updated successfully.')]);
    }

    public function destroy(Transaction $transaction, DestroyTransaction $action): RedirectResponse
    {
        Gate::authorize('delete', $transaction);

        if (! $action->handle($transaction)) {
            return back()->with(['error' => __('Failed to delete transaction.')]);
        }

        return redirect()->route('transactions.index')->with(['success' => __('Transaction deleted successfully.')]);
    }
}
