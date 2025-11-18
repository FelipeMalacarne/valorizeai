<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Actions\Category\EnsureDefaultCategoriesForUser;
use App\Enums\AccountType;
use App\Enums\Currency;
use App\Http\Controllers\Controller;
use App\Models\Account;
use App\Models\Bank;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

final class LoadTestUserTokenController extends Controller
{
    public function __invoke(EnsureDefaultCategoriesForUser $ensureDefaultCategories): JsonResponse
    {
        $user = DB::transaction(function () {
            $bankId = Bank::query()->value('id');

            if ($bankId === null) {
                $bank = Bank::create([
                    'name' => 'Load Test Bank',
                    'code' => '999',
                ]);
                $bankId = $bank->id;
            }

            /** @var \App\Models\User $user */
            $user = User::create([
                'name'               => sprintf('k6 Load Test %s', now()->format('YmdHisv')),
                'email'              => sprintf('k6+%s@valorizeai.test', Str::uuid()),
                'password'           => Hash::make(Str::random(32)),
                'email_verified_at'  => now(),
                'preferred_currency' => Currency::BRL->value,
            ]);

            foreach (range(1, 3) as $index) {
                Account::create([
                    'name'     => sprintf('k6 Account %d', $index),
                    'balance'  => 0,
                    'currency' => $user->preferred_currency,
                    'type'     => AccountType::CHECKING,
                    'number'   => Str::upper(Str::random(8)),
                    'user_id'  => $user->id,
                    'bank_id'  => $bankId,
                ]);
            }

            return $user->refresh();
        });

        $ensureDefaultCategories->handle($user);

        $expiresAt = now()->addDay();
        $token = $user->createToken(
            sprintf('k6-mix-%s', now()->format('YmdHisv')),
            ['*'],
            $expiresAt
        );

        return response()->json([
            'token'      => $token->plainTextToken,
            'user_id'    => $user->id,
            'email'      => $user->email,
            'expires_at' => $expiresAt->toIso8601String(),
        ], 201);
    }
}
