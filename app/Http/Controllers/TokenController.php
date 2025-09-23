<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\User\StoreToken;
use App\Http\Requests\User\StoreTokenRequest;
use App\Http\Resources\TokenResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Laravel\Sanctum\PersonalAccessToken;

final class TokenController extends Controller
{
    public function index(Request $request)
    {
        $tokens = $request->user()->tokens;

        return Inertia::render('Tokens/index', [
            'tokens' => TokenResource::collect($tokens),
        ]);
    }

    public function store(StoreTokenRequest $data, StoreToken $action, Request $request)
    {
        $plainTextToken = $action->handle($data, Auth::user());

        if ($request->wantsJson()) {
            return response()->json([
                'success' => __('Token criado com sucesso'),
                'token'   => $plainTextToken,
            ]);
        }

        return back()->with([
            'success' => __('Token criado com sucesso'),
            'token'   => $plainTextToken,
        ]);
    }

    public function destroy(Request $request, PersonalAccessToken $token)
    {
        // Gate::authorize('destroyTokens', Auth::user()->organization);

        $token->delete();
        if ($request->wantsJson()) {
            return response()->json([
                'success' => __('Token deletado com sucesso'),
            ]);
        }

        return back()->with([
            'success' => __('Token deletado com sucesso'),
        ]);
    }
}
