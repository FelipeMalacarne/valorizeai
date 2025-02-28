<?php

namespace App\Http\Controllers;

use App\Domain\Transaction\Projections\Transaction;
use App\Http\Resources\TransactionResource;
use App\Models\User;
use Illuminate\Container\Attributes\CurrentUser;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\EventSourcing\Commands\CommandBus;

class TransactionsController extends Controller
{
    public function __construct(
        private CommandBus $bus,
        #[CurrentUser] private User $user
    ) {}

    public function index(Request $request): Response
    {
        $accounts = $this->user->accounts()->pluck('id')->toArray();

        $transactions = Transaction::search($request->query('search'))
            ->whereIn('account_id', $accounts)
            ->orderByDesc('created_at')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Transactions/Index', [
            'transactions' => TransactionResource::collection($transactions),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
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
