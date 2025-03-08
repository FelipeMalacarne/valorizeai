<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Domain\Category\Projections\Category;
use App\Domain\Explorer\Enums\MultiMatchType;
use App\Domain\Explorer\Syntax\MultiMatch;
use App\Domain\Transaction\Projections\Transaction;
use App\Domain\Transaction\Queries\IndexTransactionsQuery;
use App\Http\Resources\TransactionResource;
use App\Models\User;
use App\Support\CQRS\Query;
use App\Support\CQRS\QueryBusContract;
use Illuminate\Container\Attributes\CurrentUser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\EventSourcing\Commands\CommandBus;

final class TransactionsController extends Controller
{
    /**
     * @param QueryBusContract<mixed,Query<T>> $queryBus
     */
    public function __construct(
        private CommandBus $commandBus,
        private QueryBusContract $queryBus,
        #[CurrentUser] private User $user
    ) {}

    public function index(IndexTransactionsQuery $query): Response
    {
        $transactions = $this->queryBus->dispatch($query);

        $transactions->load(['categories', 'account']);

        $categories = Cache::remember("categories:{$this->user->id}", now()->addMinutes(10), function () {
            return Category::whereUser($this->user->id)->get();
        });

        return Inertia::render('transactions/index', [
            'transactions' => TransactionResource::collection($transactions),
            'categories'   => $categories,
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
