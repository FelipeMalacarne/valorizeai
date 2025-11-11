<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\Import\ApproveImportTransaction;
use App\Actions\Import\BulkApproveImportTransactions;
use App\Actions\Import\RejectImportTransaction;
use App\Http\Requests\Import\ApproveImportTransactionRequest;
use App\Http\Requests\Import\BulkApproveImportTransactionsRequest;
use App\Models\Import;
use App\Models\ImportTransaction;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\ValidationException;

final class ImportTransactionController extends Controller
{
    public function approve(
        Request $request,
        Import $import,
        ImportTransaction $importTransaction,
        ApproveImportTransactionRequest $args,
        ApproveImportTransaction $action
    ): RedirectResponse|JsonResponse {
        Gate::authorize('review', $import);
        $this->ensureRelationship($import, $importTransaction);

        $action->handle($importTransaction, $args);

        return $this->respond($request, __('Transação aprovada com sucesso.'));
    }

    public function reject(
        Request $request,
        Import $import,
        ImportTransaction $importTransaction,
        RejectImportTransaction $action
    ): RedirectResponse|JsonResponse {
        Gate::authorize('review', $import);
        $this->ensureRelationship($import, $importTransaction);

        $action->handle($importTransaction);

        return $this->respond($request, __('Transação rejeitada com sucesso.'));
    }

    public function bulkApprove(
        Request $request,
        Import $import,
        BulkApproveImportTransactionsRequest $args,
        BulkApproveImportTransactions $action
    ): RedirectResponse|JsonResponse {
        Gate::authorize('review', $import);

        $transactions = $import->importTransactions()
            ->whereIn('id', $args->transaction_ids)
            ->get();

        if ($transactions->count() !== count($args->transaction_ids)) {
            throw ValidationException::withMessages([
                'transaction_ids' => __('Algumas transações selecionadas não pertencem a esta importação.'),
            ]);
        }

        $action->handle($import, $transactions, $args->category_id);

        return $this->respond($request, __('Transações aprovadas com sucesso.'));
    }

    private function ensureRelationship(Import $import, ImportTransaction $importTransaction): void
    {
        if ($importTransaction->import_id !== $import->id) {
            abort(404);
        }
    }

    private function respond(Request $request, string $message): RedirectResponse|JsonResponse
    {
        if ($request->wantsJson()) {
            return response()->json(['message' => $message]);
        }

        return back()->with('success', $message);
    }
}
