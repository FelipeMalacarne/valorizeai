<?php

declare(strict_types=1);

namespace Tests\Unit\Services\StatementParser;

use App\Enums\AccountType;
use App\Enums\Currency;
use App\Enums\TransactionType;
use App\Services\Statement\Parsers\OfxParser;
use App\ValueObjects\Money;
use Carbon\Carbon;

it('should parse the ofx file content', function () {
    $parser = app(OfxParser::class);
    $statement = $parser->parse(file_get_contents(__DIR__.'/ofx-fake.ofx'));

    expect($statement->startDate)->toEqual(Carbon::createFromFormat('Y-m-d H:i:s', '2025-01-01 00:00:00'))
        ->and($statement->endDate)->toEqual(Carbon::createFromFormat('Y-m-d H:i:s', '2025-01-31 00:00:00'))
        ->and($statement->transactions)->toHaveCount(2);

    $creditTransaction = $statement->transactions->first();

    expect($creditTransaction->type)->toBe(TransactionType::CREDIT)
        ->and($creditTransaction->date)->toEqual(Carbon::createFromFormat('Y-m-d H:i:s', '2025-01-15 00:00:00'))
        ->and($creditTransaction->amount)->toEqual(Money::from(1234.56, Currency::BRL))
        ->and($creditTransaction->memo)->toBe('Test Credit Transaction')
        ->and($creditTransaction->fitId)->toBe('1');

    $debitTransaction = $statement->transactions->last();

    expect($debitTransaction->type)->toBe(TransactionType::DEBIT)
        ->and($debitTransaction->date)->toEqual(Carbon::createFromFormat('Y-m-d H:i:s', '2025-01-16 00:00:00'))
        ->and($debitTransaction->amount)->toEqual(Money::from(-78.90, Currency::BRL))
        ->and($debitTransaction->memo)->toBe('Test Debit Transaction')
        ->and($debitTransaction->fitId)->toBe('2');
});

it('should parse the ofx file with a bank account data', function () {
    $parser = app(OfxParser::class);
    $statement = $parser->parse(file_get_contents(__DIR__.'/ofx-fake.ofx'));
    $account = $statement->bankAccount;

    expect($account->type)->toBe(AccountType::CHECKING)
        ->and($account->bankId)->toBe('0000')
        ->and($account->number)->toBe('12345-6')
        ->and($account->balance)->toBe(1155.66)
        ->and($account->balanceDate)->toEqual(Carbon::createFromFormat('Y-m-d H:i:s', '2025-01-31 00:00:00'))
        ->and($account->agencyNumber)->toBe('1');
});
