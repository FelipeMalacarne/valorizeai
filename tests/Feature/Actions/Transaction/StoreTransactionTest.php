<?php

declare(strict_types=1);

use App\Actions\Transaction\StoreTransaction;
use App\Enums\Currency;
use App\Enums\TransactionType;
use App\Events\Transaction\TransactionCreated;
use App\Http\Requests\Transaction\StoreTransactionRequest;
use App\Models\Account;
use App\Models\User;
use App\ValueObjects\Money;
use Illuminate\Support\Facades\Event;

use function Pest\Laravel\assertDatabaseHas;

it('creates a transaction and updates the account balance', function () {

    Event::fake();

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

    Event::assertDispatched(TransactionCreated::class);
});
