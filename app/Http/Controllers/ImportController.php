<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\Import\CreateImport;
use App\Enums\ImportTransactionStatus;
use App\Http\Requests\Import\ImportRequest;
use App\Http\Requests\Import\ImportTransactionIndexRequest;
use App\Http\Requests\Import\IndexImportRequest;
use App\Http\Requests\Import\UpdateImportAccountRequest;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\ImportResource;
use App\Models\Import;
use App\Queries\Account\UserAccountsQuery;
use App\Queries\Category\UserCategoriesQuery;
use App\Queries\Import\IndexImportsQuery;
use App\Queries\Import\ListImportTransactionsQuery;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

final class ImportController extends Controller
{
    public function index(IndexImportRequest $request, IndexImportsQuery $imports): Response
    {
        return Inertia::render('imports/index', [
            'imports' => fn () => $imports->resource($request, Auth::user()),
            'filters' => $request,
        ]);
    }

    public function show(
        Import $import,
        ImportTransactionIndexRequest $request,
        ListImportTransactionsQuery $transactions,
        UserCategoriesQuery $categories,
        UserAccountsQuery $accounts
    ): Response {
        Gate::authorize('view', $import);

        $import->load(['account.bank'])
            ->loadCount([
                'importTransactions as pending_transactions' => fn ($query) => $query->whereIn('status', [
                    ImportTransactionStatus::NEW,
                    ImportTransactionStatus::CONFLICTED,
                ]),
                'importTransactions as approved_transactions' => fn ($query) => $query->where('status', ImportTransactionStatus::APPROVED),
                'importTransactions as rejected_transactions' => fn ($query) => $query->where('status', ImportTransactionStatus::REJECTED),
            ]);

        return Inertia::render('imports/show', [
            'import'        => ImportResource::from($import),
            'transactions'  => fn () => $transactions->resource($request, $import),
            'categories'    => fn () => $categories->resource(Auth::id()),
            'accounts'      => fn () => $accounts->resource(Auth::id()),
            'filters'       => $request,
        ]);
    }

    public function updateAccount(Import $import, UpdateImportAccountRequest $request): RedirectResponse
    {
        Gate::authorize('review', $import);

        $import->forceFill([
            'account_id' => $request->account_id,
        ])->save();

        return back()->with('success', __('Conta vinculada com sucesso. Você já pode revisar as transações.'));
    }

    public function store(Request $request, ImportRequest $args, CreateImport $action): RedirectResponse|JsonResponse
    {
        $imports = $action->handle($args, Auth::user());

        if ($request->wantsJson()) {
            return response()->json([
                'message' => __('Arquivos importados com sucesso'),
                'imports' => $imports->toArray(),
            ], 201);
        }

        return to_route('imports.index')->with([
            'success' => __('Arquivos importados com sucesso'),
        ]);
    }
}
