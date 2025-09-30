<?php

declare(strict_types=1);

namespace Tests\Unit;

use App\Enums\Currency;
use App\Enums\ImportTransactionStatus;
use App\Models\Category;
use App\Models\Import;
use App\Models\ImportTransaction;
use App\Models\Transaction;
use App\ValueObjects\Money;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

uses(TestCase::class, RefreshDatabase::class);

it('can create an import transaction using factory', function () {
    $importTransaction = ImportTransaction::factory()->create();
    expect($importTransaction)->toBeInstanceOf(ImportTransaction::class);
});

it('belongs to an import', function () {
    $import = Import::factory()->create();
    $importTransaction = ImportTransaction::factory()->for($import)->create();

    expect($importTransaction->import)->toBeInstanceOf(Import::class)
        ->and($importTransaction->import->id)->toBe($import->id);
});

it('belongs to a category', function () {
    $category = Category::factory()->create();
    $importTransaction = ImportTransaction::factory()->for($category)->create();

    expect($importTransaction->category)->toBeInstanceOf(Category::class)
        ->and($importTransaction->category->id)->toBe($category->id);
});

it('can belong to a matched transaction', function () {
    $transaction = Transaction::factory()->create();
    $importTransaction = ImportTransaction::factory()->create([
        'matched_transaction_id' => $transaction->id,
    ]);

    expect($importTransaction->matchedTransaction)->toBeInstanceOf(Transaction::class)
        ->and($importTransaction->matchedTransaction->id)->toBe($transaction->id);
});

it('casts its attributes', function () {
    $importTransaction = ImportTransaction::factory()->create([
        'status'   => ImportTransactionStatus::PENDING,
        'currency' => Currency::BRL,
        'amount'   => 12345, // 123.45
    ]);

    $importTransaction->refresh();

    expect($importTransaction->status)->toBeInstanceOf(ImportTransactionStatus::class)
        ->and($importTransaction->status)->toBe(ImportTransactionStatus::PENDING)
        ->and($importTransaction->currency)->toBeInstanceOf(Currency::class)
        ->and($importTransaction->currency)->toBe(Currency::BRL)
        ->and($importTransaction->amount)->toBeInstanceOf(Money::class)
        ->and($importTransaction->amount->value)->toBe(12345);
});
