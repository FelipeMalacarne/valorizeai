<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Resources\TokenResource;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Laravel\Sanctum\PersonalAccessToken;

final class TokenController extends Controller
{
    private const EXPIRATION_PRESETS = [
        ['label' => '30 dias', 'value' => 30],
        ['label' => '90 dias', 'value' => 90],
        ['label' => '6 meses', 'value' => 180],
        ['label' => '1 ano', 'value' => 365],
        ['label' => 'Sem expiração', 'value' => null],
    ];

    public function index(Request $request): Response
    {
        $user = $request->user();
        $tokens = $user->tokens()->latest()->get();
        $now = now();
        $monthStart = $now->copy()->startOfMonth();

        $recentUsage = $user->tokens()
            ->whereNotNull('last_used_at')
            ->orderByDesc('last_used_at')
            ->first();

        $stats = [
            'total'              => $tokens->count(),
            'active'             => $tokens->filter(fn (PersonalAccessToken $token) => $this->isTokenActive($token))->count(),
            'created_this_month' => $tokens->filter(fn (PersonalAccessToken $token) => $token->created_at?->greaterThanOrEqualTo($monthStart))->count(),
            'last_used_at'       => $recentUsage?->last_used_at?->toIso8601String(),
        ];

        $generatedToken = $request->session()->pull('generated_token');

        return Inertia::render('tokens/index', [
            'tokens'             => TokenResource::collect(
                $tokens->map(fn (PersonalAccessToken $token) => [
                    'id'         => (string) $token->id,
                    'name'       => $token->name,
                    'abilities'  => $this->sanitizeAbilities($token->abilities),
                    'lastUsedAt' => $token->last_used_at,
                    'expiresAt'  => $token->expires_at,
                    'createdAt'  => $token->created_at,
                ])
            ),
            'stats'              => $stats,
            'expiration_presets' => self::EXPIRATION_PRESETS,
            'generated_token'    => $generatedToken,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name'        => ['required', 'string', 'max:255'],
            'expires_in'  => ['nullable', 'integer', 'min:1', 'max:3650'],
        ]);

        $abilities = ['*'];
        $expiresAt = isset($validated['expires_in']) ? now()->addDays((int) $validated['expires_in']) : null;

        $newToken = $request->user()->createToken($validated['name'], $abilities, $expiresAt);

        return redirect()
            ->route('tokens.index')
            ->with('success', __('Token ":name" criado com sucesso.', ['name' => $validated['name']]))
            ->with('generated_token', [
                'name'             => $validated['name'],
                'plain_text_token' => $newToken->plainTextToken,
                'abilities'        => $abilities,
                'expires_at'       => $expiresAt?->toIso8601String(),
            ]);
    }

    public function destroy(Request $request, PersonalAccessToken $token): RedirectResponse
    {
        $this->ensureTokenBelongsToUser($request, $token);

        $tokenName = $token->name;
        $token->delete();

        return redirect()
            ->route('tokens.index')
            ->with('success', __('Token ":name" revogado com sucesso.', ['name' => $tokenName]));
    }

    private function ensureTokenBelongsToUser(Request $request, PersonalAccessToken $token): void
    {
        $user = $request->user();

        if ($token->tokenable_id !== $user->getAuthIdentifier() || $token->tokenable_type !== $user::class) {
            abort(404);
        }
    }

    /**
     * @param list<string>|null $abilities
     *
     * @return list<string>
     */
    private function sanitizeAbilities(?array $abilities): array
    {
        $normalized = collect($abilities ?? ['*'])
            ->filter(fn ($ability) => is_string($ability) && $ability !== '')
            ->values();

        if ($normalized->isEmpty() || $normalized->contains('*')) {
            return ['*'];
        }

        return $normalized->unique()->values()->all();
    }

    /**
     * @return list<string>
     */
    private function isTokenActive(PersonalAccessToken $token): bool
    {
        return $token->expires_at === null || $token->expires_at->isFuture();
    }
}
