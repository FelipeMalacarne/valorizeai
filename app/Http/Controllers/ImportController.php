<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\Import\CreateImport;
use App\Http\Requests\Import\ImportRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

final class ImportController extends Controller
{
    public function store(Request $request, ImportRequest $args, CreateImport $action): RedirectResponse|JsonResponse
    {
        $imports = $action->handle($args, Auth::user());

        if ($request->wantsJson()) {
            return response()->json([
                'message' => __('Arquivos importados com sucesso'),
                'imports' => $imports->toArray(),
            ], 201);
        }

        return to_route('transactions.index')->with([
            'success' => __('Arquivos importados com sucesso'),
        ]);
    }
}
