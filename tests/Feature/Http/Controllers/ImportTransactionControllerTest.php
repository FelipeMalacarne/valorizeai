<?php

declare(strict_types=1);

use App\Enums\Currency;
use App\Enums\ImportStatus;
use App\Enums\ImportTransactionStatus;
use App\Enums\TransactionType;
use App\Models\Account;
use App\Models\Category;
use App\Models\Import;
use App\Models\ImportTransaction;
use App\Models\Transaction;
use App\Models\User;
use App\ValueObjects\Money;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('approves an import transaction by creating a transaction', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $account = Account::factory()->for($user)->create([
        'currency' => Currency::BRL,
    ]);

    $category = Category::factory()->for($user)->create();

    $import = Import::factory()->for($user)->for($account)->create([
        'status' => ImportStatus::PENDING_REVIEW,
    ]);

    $importTransaction = ImportTransaction::factory()->for($import)->create([
        'status'   => ImportTransactionStatus::NEW,
        'currency' => Currency::BRL,
        'type'     => TransactionType::DEBIT,
        'amount'   => new Money(1200, Currency::BRL),
        'memo'     => 'Coffee shop',
        'fitid'    => 'FIT-APPROVE',
    ]);

    $response = $this->post(route('imports.transactions.approve', [$import, $importTransaction]), [
        'category_id' => $category->id,
    ]);

    $response->assertRedirect();

    $importTransaction->refresh();
    $import->refresh();

    expect($importTransaction->status)->toBe(ImportTransactionStatus::APPROVED)
        ->and($importTransaction->transaction_id)->not()->toBeNull();

    $this->assertDatabaseHas('transactions', [
        'id'         => $importTransaction->transaction_id,
        'fitid'      => 'FIT-APPROVE',
        'category_id'=> $category->id,
    ]);

    expect($import->status)->toBe(ImportStatus::COMPLETED)
        ->and($import->new_count)->toBe(0);
});

it('replaces a matched transaction when requested', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $account = Account::factory()->for($user)->create([
        'currency' => Currency::USD,
    ]);

    $import = Import::factory()->for($user)->for($account)->create([
        'status' => ImportStatus::PENDING_REVIEW,
    ]);

    $existingTransaction = Transaction::factory()->for($account)->create([
        'memo'     => 'Old memo',
        'fitid'    => 'FIT-OLD',
        'amount'   => new Money(5000, Currency::USD),
        'currency' => Currency::USD,
    ]);

    $importTransaction = ImportTransaction::factory()->for($import)->create([
        'status'                 => ImportTransactionStatus::CONFLICTED,
        'matched_transaction_id' => $existingTransaction->id,
        'currency'               => Currency::USD,
        'amount'                 => new Money(7500, Currency::USD),
        'type'                   => TransactionType::CREDIT,
        'memo'                   => 'Updated memo',
        'fitid'                  => 'FIT-OLD',
    ]);

    $this->post(route('imports.transactions.approve', [$import, $importTransaction]), [
        'replace_existing' => true,
    ])->assertRedirect();

    $existingTransaction->refresh();
    $importTransaction->refresh();
    $import->refresh();

    expect($importTransaction->status)->toBe(ImportTransactionStatus::APPROVED)
        ->and($importTransaction->transaction_id)->toBe($existingTransaction->id)
        ->and($existingTransaction->amount->value)->toBe(7500)
        ->and($existingTransaction->memo)->toBe('Updated memo');

    expect($import->status)->toBe(ImportStatus::COMPLETED)
        ->and($import->conflicted_count)->toBe(0);
});

it('rejects an import transaction and keeps import pending if others exist', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $account = Account::factory()->for($user)->create([
        'currency' => Currency::EUR,
    ]);

    $import = Import::factory()->for($user)->for($account)->create([
        'status' => ImportStatus::PENDING_REVIEW,
    ]);

    $pending = ImportTransaction::factory()->count(2)->for($import)->state([
        'currency' => Currency::EUR,
        'amount'   => new Money(1000, Currency::EUR),
        'status'   => ImportTransactionStatus::NEW,
    ])->create();

    $this->post(route('imports.transactions.reject', [$import, $pending->first()]))->assertRedirect();

    $import->refresh();

    expect($pending->first()->fresh()->status)->toBe(ImportTransactionStatus::REJECTED)
        ->and($import->status)->toBe(ImportStatus::PENDING_REVIEW)
        ->and($import->new_count)->toBe(1);
});

it('approves multiple new transactions in bulk with a single category', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $account = Account::factory()->for($user)->create([
        'currency' => Currency::BRL,
    ]);

    $category = Category::factory()->for($user)->create();

    $import = Import::factory()->for($user)->for($account)->create([
        'status' => ImportStatus::PENDING_REVIEW,
    ]);

    $transactions = ImportTransaction::factory()->count(3)->for($import)->state([
        'status'   => ImportTransactionStatus::NEW,
        'currency' => Currency::BRL,
        'amount'   => new Money(1000, Currency::BRL),
    ])->create();

    $this->post(route('imports.transactions.bulk-approve', $import), [
        'transaction_ids' => $transactions->pluck('id')->all(),
        'category_id'     => $category->id,
    ])->assertRedirect();

    $import->refresh();

    expect($import->status)->toBe(ImportStatus::COMPLETED);
    expect($transactions->map(fn ($t) => $t->fresh()->status)->all())->each->toBe(ImportTransactionStatus::APPROVED);
    expect(\App\Models\Transaction::query()->where('account_id', $account->id)->count())->toBe(3)
        ->and($import->new_count)->toBe(0);
});
