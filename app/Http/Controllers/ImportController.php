<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\Import\CreateImport;
use App\Http\Requests\Import\ImportRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

final class ImportController extends Controller
{
    public function store(ImportRequest $request, CreateImport $action): JsonResponse
    {
        $imports = $action->handle($request, Auth::user());

        return response()->json([
            'message' => 'Files uploaded and imports created successfully.',
            'imports' => $imports->toArray(),
        ], 201);
    }
}
