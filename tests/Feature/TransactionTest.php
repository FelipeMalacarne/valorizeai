<?php

declare(strict_types=1);

use App\Actions\Transaction\StoreTransaction;
use App\Enums\Currency;
use App\Enums\TransactionType;
use App\Http\Requests\Transaction\StoreTransactionRequest;
use App\Models\Account;
use App\Models\Transaction;
use App\Models\User;
use App\ValueObjects\Money;

test('user can create a transaction', function () {
    $user = User::factory()->create();
    $account = Account::factory()->for($user)->create();

    $data = StoreTransactionRequest::from([
        'account_id'  => $account->id,
        'category_id' => null,
        'amount'      => new Money(10000, Currency::BRL),
        'type'        => TransactionType::DEBIT,
        'date'        => now(),
        'memo'        => 'Test transaction',
    ]);

    $transaction = app(StoreTransaction::class)->handle($data);

    expect($transaction)->toBeInstanceOf(Transaction::class);
    expect($transaction->amount->amount)->toBe(10000);
    expect($transaction->amount->currency)->toBe(Currency::BRL);
    expect($transaction->account_id)->toBe($account->id);
});
