<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Actions\Account\DestroyAccount;
use App\Actions\Account\StoreAccount;
use App\Actions\Account\UpdateAccount;
use App\Http\Requests\Account\IndexAccountsRequest;
use App\Http\Requests\Account\StoreAccountRequest;
use App\Http\Requests\Account\UpdateAccountRequest;
use App\Http\Resources\AccountResource;
use App\Models\Account;
use App\Queries\ListAccountsQuery;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;

final class AccountController extends Controller
{
    public function index(
        IndexAccountsRequest $request,
        ListAccountsQuery $accounts,
    ): JsonResponse {
        $user = Auth::user();

        abort_unless($user, 403);

        return response()->json(
            $accounts->resource($request, $user)->toArray()
        );
    }

    public function show(Account $account): JsonResponse
    {
        Gate::authorize('view', $account);

        return response()->json(
            AccountResource::from($account->load('bank'))->toArray()
        );
    }

    public function store(StoreAccountRequest $request, StoreAccount $action): JsonResponse
    {
        $user = Auth::user();
        abort_unless($user, 403);

        $account = $action->handle($request, $user)->load('bank');

        return response()->json(
            AccountResource::from($account)->toArray(),
            201
        );
    }

    public function update(UpdateAccountRequest $request, Account $account, UpdateAccount $action): JsonResponse
    {
        Gate::authorize('update', $account);

        $updated = $action->handle($request, $account)->load('bank');

        return response()->json(
            AccountResource::from($updated)->toArray()
        );
    }

    public function destroy(Account $account, DestroyAccount $action): JsonResponse
    {
        Gate::authorize('delete', $account);

        if (! $action->handle($account)) {
            return response()->json([
                'message' => __('Failed to delete account.'),
            ], 422);
        }

        return response()->json(status: 204);
    }
}
