<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\Import\CreateImport;
use App\Http\Requests\Import\ImportRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;

final class ImportController extends Controller
{
    public function store(ImportRequest $request, CreateImport $action): RedirectResponse
    {
        $action->handle($request, Auth::user());

        return to_route('transactions.index')->with([
            'success' => __('Arquivos importados com sucesso'),
        ]);
    }
}
