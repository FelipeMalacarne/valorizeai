<?php

declare(strict_types=1);

use App\Actions\Import\ProcessImport;
use App\Enums\AccountType;
use App\Enums\Currency;
use App\Enums\ImportExtension;
use App\Enums\ImportStatus;
use App\Enums\ImportTransactionStatus;
use App\Enums\TransactionType;
use App\Models\Account;
use App\Models\Bank;
use App\Models\Import;
use App\Models\Transaction;
use App\Models\User;
use App\Services\Statement\Data\BankAccountData;
use App\Services\Statement\Data\StatementData;
use App\Services\Statement\Data\TransactionData;
use App\Services\Statement\Parsers\OfxParser;
use App\ValueObjects\Money;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Storage;

uses(RefreshDatabase::class);

afterEach(function (): void {
    \Mockery::close();
});

test('it marks imported transactions as matched when fitid corresponds to an existing transaction', function () {
    Storage::shouldReceive('get')->andReturn('OFX-CONTENT');

    $user = User::factory()->create();

    $bank = Bank::factory()->create([
        'code' => '341',
        'name' => 'Test Bank',
    ]);

    $account = Account::factory()->for($bank)->for($user)->create([
        'type'     => AccountType::CHECKING,
        'number'   => '123456',
        'currency' => Currency::BRL,
    ]);

    $existingTransaction = Transaction::factory()->for($account)->create([
        'fitid'    => 'FIT123',
        'date'     => Carbon::parse('2024-01-10'),
        'amount'   => new Money(12500, Currency::BRL),
        'memo'     => 'Coffee Shop Purchase',
        'type'     => TransactionType::DEBIT,
        'currency' => Currency::BRL,
    ]);

    $import = Import::factory()->for($user)->create([
        'status'           => ImportStatus::PROCESSING,
        'extension'        => ImportExtension::OFX,
        'new_count'        => 0,
        'matched_count'    => 0,
        'conflicted_count' => 0,
    ]);

    $statement = new StatementData(
        startDate: Carbon::parse('2024-01-01'),
        endDate: Carbon::parse('2024-01-31'),
        transactions: Collection::make([
            new TransactionData(
                type: TransactionType::DEBIT,
                date: Carbon::parse('2024-01-10'),
                amount: Money::from(125, Currency::BRL),
                memo: 'Coffee Shop Purchase',
                fitid: 'FIT123',
            ),
        ]),
        currency: Currency::BRL,
        bankAccount: new BankAccountData(
            type: AccountType::CHECKING,
            bankId: '341',
            bankName: 'Test Bank',
            agencyNumber: '0001',
            number: '123456',
            balance: 0.0,
            balanceDate: Carbon::parse('2024-01-31'),
        ),
    );

    $parser = \Mockery::mock(OfxParser::class);
    $parser->shouldReceive('parse')->once()->andReturn($statement);

    (new ProcessImport($parser))->handle($import);

    $import->refresh();

    expect($import->status)->toBe(ImportStatus::COMPLETED)
        ->and($import->matched_count)->toBe(1)
        ->and($import->new_count)->toBe(0)
        ->and($import->conflicted_count)->toBe(0)
        ->and($import->account_id)->toBe($account->id);

    $importTransaction = $import->importTransactions()->first();

    expect($importTransaction)->not()->toBeNull()
        ->and($importTransaction->status)->toBe(ImportTransactionStatus::MATCHED)
        ->and($importTransaction->matched_transaction_id)->toBe($existingTransaction->id);
});

test('it marks imported transactions as new when no matches are found', function () {
    Storage::shouldReceive('get')->andReturn('OFX-CONTENT');

    $user = User::factory()->create();

    $bank = Bank::factory()->create([
        'code' => '001',
        'name' => 'Bank Zero',
    ]);

    Account::factory()->for($bank)->for($user)->create([
        'type'     => AccountType::CHECKING,
        'number'   => '987654',
        'currency' => Currency::USD,
    ]);

    $import = Import::factory()->for($user)->create([
        'status'           => ImportStatus::PROCESSING,
        'extension'        => ImportExtension::OFX,
        'new_count'        => 0,
        'matched_count'    => 0,
        'conflicted_count' => 0,
    ]);

    $statement = new StatementData(
        startDate: Carbon::parse('2024-02-01'),
        endDate: Carbon::parse('2024-02-28'),
        transactions: Collection::make([
            new TransactionData(
                type: TransactionType::CREDIT,
                date: Carbon::parse('2024-02-05'),
                amount: Money::from(300.50, Currency::USD),
                memo: 'Salary Payment',
                fitid: 'FIT999',
            ),
        ]),
        currency: Currency::USD,
        bankAccount: new BankAccountData(
            type: AccountType::CHECKING,
            bankId: '001',
            bankName: 'Bank Zero',
            agencyNumber: '0001',
            number: '987654',
            balance: 0.0,
            balanceDate: Carbon::parse('2024-02-28'),
        ),
    );

    $parser = \Mockery::mock(OfxParser::class);
    $parser->shouldReceive('parse')->once()->andReturn($statement);

    (new ProcessImport($parser))->handle($import);

    $import->refresh();

    expect($import->status)->toBe(ImportStatus::PENDING_REVIEW)
        ->and($import->new_count)->toBe(1)
        ->and($import->matched_count)->toBe(0)
        ->and($import->conflicted_count)->toBe(0)
        ->and($import->account_id)->not()->toBeNull();

    $importTransaction = $import->importTransactions()->first();

    expect($importTransaction)->not()->toBeNull()
        ->and($importTransaction->status)->toBe(ImportTransactionStatus::NEW)
        ->and($importTransaction->matched_transaction_id)->toBeNull();
});

test('it marks imported transactions as conflicted when multiple candidates exist', function () {
    Storage::shouldReceive('get')->andReturn('OFX-CONTENT');

    $user = User::factory()->create();

    $bank = Bank::factory()->create([
        'code' => '237',
        'name' => 'Conflicted Bank',
    ]);

    $account = Account::factory()->for($bank)->for($user)->create([
        'type'     => AccountType::CHECKING,
        'number'   => '654321',
        'currency' => Currency::EUR,
    ]);

    Transaction::factory()->for($account)->create([
        'fitid'    => 'FIT123',
        'date'     => Carbon::parse('2024-03-15'),
        'amount'   => new Money(4500, Currency::EUR),
        'memo'     => 'POS 12345',
        'type'     => TransactionType::DEBIT,
        'currency' => Currency::EUR,
    ]);

    $import = Import::factory()->for($user)->create([
        'status'           => ImportStatus::PROCESSING,
        'extension'        => ImportExtension::OFX,
        'new_count'        => 0,
        'matched_count'    => 0,
        'conflicted_count' => 0,
    ]);

    $statement = new StatementData(
        startDate: Carbon::parse('2024-03-01'),
        endDate: Carbon::parse('2024-03-31'),
        transactions: Collection::make([
            new TransactionData(
                type: TransactionType::DEBIT,
                date: Carbon::parse('2024-03-15'),
                amount: Money::from(500, Currency::EUR),
                memo: 'POS 54321',
                fitid: 'FIT123',
            ),
        ]),
        currency: Currency::EUR,
        bankAccount: new BankAccountData(
            type: AccountType::CHECKING,
            bankId: '237',
            bankName: 'Conflicted Bank',
            agencyNumber: '0001',
            number: '654321',
            balance: 0.0,
            balanceDate: Carbon::parse('2024-03-31'),
        ),
    );

    $parser = \Mockery::mock(OfxParser::class);
    $parser->shouldReceive('parse')->once()->andReturn($statement);

    (new ProcessImport($parser))->handle($import);

    $import->refresh();

    expect($import->status)->toBe(ImportStatus::PENDING_REVIEW)
        ->and($import->conflicted_count)->toBe(1)
        ->and($import->matched_count)->toBe(0)
        ->and($import->new_count)->toBe(0)
        ->and($import->account_id)->toBe($account->id);

    $importTransaction = $import->importTransactions()->first();

    expect($importTransaction)->not()->toBeNull()
        ->and($importTransaction->status)->toBe(ImportTransactionStatus::CONFLICTED)
        ->and($importTransaction->matched_transaction_id)->not()->toBeNull();
});
