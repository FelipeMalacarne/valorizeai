<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Domain\Account\Commands\CreateAccount;
use App\Domain\Account\Commands\DeleteAccount;
use App\Domain\Account\Enums\Color;
use App\Domain\Account\Projections\Account;
use App\Http\Resources\AccountResource;
use App\Models\User;
use Illuminate\Container\Attributes\CurrentUser;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\EventSourcing\Commands\CommandBus;

final class AccountController extends Controller
{
    public function __construct(
        private CommandBus $bus,
        #[CurrentUser] private User $user
    ) {}

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', Account::class);

        $accounts = Account::search()
            ->where('user_id', $request->user()->id)
            ->orderByDesc('created_at')
            ->paginate(15);

        return Inertia::render('accounts/index', [
            'filters'  => request()->all('search', 'trashed'),
            'accounts' => AccountResource::collection($accounts),
            'colors'   => Color::cases(),
        ]);
    }

    public function store(CreateAccount $command): JsonResponse
    {
        $this->bus->dispatch($command);

        return response()->json(['message' => 'Conta criada com sucesso'], 201);
    }

    public function show(string $id): Response
    {
        $account = Account::findOrFail($id);

        Gate::authorize('view', $account);

        return Inertia::render('accounts/show', [
            'account' => AccountResource::make($account),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $account = Account::findOrFail($id);

        Gate::authorize('update', $account);

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): Response
    {
        $account = Account::findOrFail($id);

        Gate::authorize('delete', $account);

        $this->bus->dispatch(new DeleteAccount(
            accountId: $account->id,
            commanderId: $this->user->id,
        ));
    }
}
