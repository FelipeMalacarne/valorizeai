<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Actions\Transaction\DestroyTransaction;
use App\Actions\Transaction\StoreTransaction;
use App\Actions\Transaction\UpdateTransaction;
use App\Http\Requests\Transaction\IndexTransactionRequest;
use App\Http\Requests\Transaction\StoreTransactionRequest;
use App\Http\Requests\Transaction\UpdateTransactionRequest;
use App\Http\Resources\TransactionResource;
use App\Models\Transaction;
use App\Queries\Transaction\IndexTransactionsQuery;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;

final class TransactionController extends Controller
{
    public function index(
        IndexTransactionRequest $request,
        IndexTransactionsQuery $transactions
    ): JsonResponse {
        $user = Auth::user();

        abort_unless($user, 403);

        return response()->json(
            $transactions->resource($request, $user)->toArray()
        );
    }

    public function show(Transaction $transaction): JsonResponse
    {
        Gate::authorize('view', $transaction);

        $transaction->load(['splits.category', 'category', 'account.bank']);

        return response()->json(
            TransactionResource::from($transaction)->toArray()
        );
    }

    public function store(StoreTransactionRequest $request, StoreTransaction $action): JsonResponse
    {
        $user = Auth::user();
        abort_unless($user, 403);

        $transaction = $action->handle($request)->load(['account.bank', 'category', 'splits.category']);

        return response()->json(
            TransactionResource::from($transaction)->toArray(),
            201
        );
    }

    public function update(
        UpdateTransactionRequest $request,
        Transaction $transaction,
        UpdateTransaction $action
    ): JsonResponse {
        Gate::authorize('update', $transaction);

        $updated = $action->handle($request, $transaction)->load(['account.bank', 'category', 'splits.category']);

        return response()->json(
            TransactionResource::from($updated)->toArray()
        );
    }

    public function destroy(Transaction $transaction, DestroyTransaction $action): JsonResponse
    {
        Gate::authorize('delete', $transaction);

        if (! $action->handle($transaction)) {
            return response()->json([
                'message' => __('Failed to delete transaction.'),
            ], 422);
        }

        return response()->json(status: 204);
    }
}
