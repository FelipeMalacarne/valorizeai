<?php

declare(strict_types=1);

use App\Actions\Transaction\StoreTransaction;
use App\Enums\Currency;
use App\Enums\TransactionType;
use App\Http\Requests\Transaction\StoreTransactionRequest;
use App\Models\Account;
use App\Models\User;
use App\ValueObjects\Money;

use function Pest\Laravel\assertDatabaseHas;

it('creates a transaction and updates the account balance', function () {

    $user = User::factory()->create();
    $account = Account::factory()->create([
        'user_id'  => $user->id,
        'balance'  => 10000, // R$100,00 em centavos
        'currency' => Currency::BRL,
    ]);

    $transactionData = [
        'account_id'  => $account->id,
        'category_id' => null,
        'amount'      => new Money(-2500, Currency::BRL),
        'type'        => TransactionType::DEBIT,
        'date'        => now(),
        'memo'        => 'Test transaction',
    ];

    $request = StoreTransactionRequest::from($transactionData);

    $action = new StoreTransaction();
    $transaction = $action->handle($request);

    assertDatabaseHas('transactions', [
        'id'         => $transaction->id,
        'account_id' => $account->id,
        'amount'     => -2500,
    ]);

    $account->refresh();
    expect($account->balance->value)->toBe(7500); // 10000 - 2500 = 7500
});

