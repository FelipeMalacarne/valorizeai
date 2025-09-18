<?php

declare(strict_types=1);

use App\Actions\Transaction\StoreTransaction;
use App\Enums\Currency;
use App\Enums\TransactionType;
use App\Http\Requests\Transaction\StoreTransactionRequest;
use App\Models\Account;
use App\Models\Transaction;
use App\Models\User;
use App\Models\TransactionSplit;
use App\Models\Category;
use App\ValueObjects\Money;

test('user can create a transaction', function () {
    $user = User::factory()->create();
    $account = Account::factory()->for($user)->create(['currency' => Currency::BRL]);

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
    expect($transaction->amount->value)->toBe(10000);
    expect($transaction->amount->currency)->toBe(Currency::BRL);
    expect($transaction->account_id)->toBe($account->id);
});

test('transaction can have splits', function () {
    $user = User::factory()->create();
    $account = Account::factory()->for($user)->create(['currency' => Currency::BRL]);
    $category = \App\Models\Category::factory()->create(); // Need a category for splits

    // Create transaction with a specific currency
    $transaction = Transaction::factory()->for($account)->create(['currency' => Currency::BRL]);

    // Create splits for the transaction, using the same currency
    $split1 = \App\Models\TransactionSplit::factory()->create([
        'transaction_id' => $transaction->id,
        'category_id'    => $category->id,
        'amount'         => new Money(5000, Currency::BRL),
    ]);

    $split2 = \App\Models\TransactionSplit::factory()->create([
        'transaction_id' => $transaction->id,
        'category_id'    => $category->id,
        'amount'         => new Money(5000, Currency::BRL),
    ]);

    // Reload the transaction to get the splits relationship
    $transaction->load('splits');

    expect($transaction->splits)->toHaveCount(2);
    expect($transaction->splits->first()->id)->toBe($split1->id);
    expect($transaction->splits->last()->id)->toBe($split2->id);
    expect($split1->transaction->id)->toBe($transaction->id);
    expect($split1->amount->currency)->toBe(Currency::BRL); // Assert currency
    expect($split2->amount->currency)->toBe(Currency::BRL); // Assert currency
});


