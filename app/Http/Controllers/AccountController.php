<?php

namespace App\Http\Controllers;

use App\Domain\Account\Commands\CreateAccount;
use App\Domain\Account\Enums\Color;
use App\Domain\Account\Enums\Type;
use App\Domain\Account\Projections\Account;
use App\Http\Requests\StoreAccountRequest;
use App\Http\Resources\AccountResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\EventSourcing\Commands\CommandBus;

class AccountController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $accounts = Account::search()
            ->where('user_id', $request->user()->id)
            ->orderByDesc('created_at')
            ->paginate(15);

        return Inertia::render('Accounts/Index', [
            'filters'  => request()->all('search', 'trashed'),
            'accounts' => AccountResource::collection($accounts),
            'colors'   => Color::cases(),
        ]);
    }

    public function store(StoreAccountRequest $request, CommandBus $bus): JsonResponse
    {
        $uuid = Str::uuid7();

        $bus->dispatch(new CreateAccount(
            id: $uuid,
            name: $request->name,
            color: Color::from($request->color),
            userId: $request->user()->id,
            description: $request->description,
            number: $request->number,
            type: Type::from($request->type),
            bankCode: $request->bank_code
        ));

        return response()->json(['message' => 'Conta criada com sucesso'], 201);
    }

    public function show(string $id): Response
    {
        return Inertia::render('Accounts/Show', [
            'account' => AccountResource::make(Account::findOrFail($id)),
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
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
