<?php

namespace App\Http\Controllers;

use App\Domain\Account\Commands\CreateAccount;
use App\Domain\Account\Enums\Color;
use App\Http\Requests\StoreAccountRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Spatie\EventSourcing\Commands\CommandBus;

class AccountController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $accounts = Auth::user()->accounts()
            ->orderByDesc('created_at')
            ->paginate(15);

        return Inertia::render('Accounts/Index', [
            'filters'  => request()->all('search', 'trashed'),
            'accounts' => $accounts,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Accounts/Create', [
            'colors' => Color::cases(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreAccountRequest $request, CommandBus $bus)
    {
        $uuid = Str::uuid7();

        $bus->dispatch(new CreateAccount(
            id: $uuid,
            name: $request->name,
            color: Color::from($request->color),
            userId: $request->user()->id,
            description: $request->description,
            number: $request->number,
        ));

        return response()->json(['message' => 'Conta criada com sucesso'], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
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
