<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Domain\Explorer\Enums\MultiMatchType;
use App\Domain\Explorer\Syntax\MultiMatch;
use App\Domain\Transaction\Projections\Transaction;
use App\Http\Resources\TransactionResource;
use App\Models\User;
use Illuminate\Container\Attributes\CurrentUser;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\EventSourcing\Commands\CommandBus;

final class TransactionsController extends Controller
{
    public function __construct(
        private CommandBus $bus,
        #[CurrentUser] private User $user
    ) {}

    public function index(Request $request): Response
    {
        $accounts = $this->user->accounts()->pluck('id')->toArray();

        $search = $request->query('search');

        $transactions = Transaction::search()
            ->when($search, fn ($query) => $query->must(new MultiMatch(
                value: $search,
                fields: [
                    'description',
                    'description._2gram',
                    'description._3gram',
                    'memo',
                    'memo._2gram',
                    'memo._3gram',
                ],
                type: MultiMatchType::BOOL_PREFIX,
            )))
            ->whereIn('account_id', $accounts)
            ->orderByDesc('created_at')
            ->paginate(15)
            ->withQueryString();

        $transactions->load(['categories', 'account']);

        return Inertia::render('transactions/index', [
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
