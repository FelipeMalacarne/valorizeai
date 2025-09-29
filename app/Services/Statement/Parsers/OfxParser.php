<?php

declare(strict_types=1);

namespace App\Services\Statement\Parsers;

use App\Enums\AccountType;
use App\Enums\Currency;
use App\Enums\TransactionType;
use App\Services\Statement\Data\BankAccountData;
use App\Services\Statement\Data\StatementData;
use App\Services\Statement\Data\TransactionData;
use App\Services\Statement\StatementParser;
use App\ValueObjects\Money;
use Carbon\Carbon;
use OfxParser\Parser;

class OfxParser implements StatementParser
{
    public function __construct(
        private Parser $parser,
    ) {}

    public function parse(string $content): StatementData
    {
        $ofx = $this->parser->loadFromString($content);

        $bankAccount = $ofx->bankAccount;
        $institute = $ofx->signOn->institute;
        $statement = $bankAccount->statement;
        $transactions = collect($statement->transactions);
        $currency = Currency::from((string) $statement->currency);

        return new StatementData(
            startDate: Carbon::createFromDate($statement->startDate),
            endDate: Carbon::createFromDate($statement->endDate),
            currency: $currency,
            transactions: $transactions->map(fn ($transaction) => new TransactionData(
                type: TransactionType::from(mb_strtolower($transaction->type)),
                date: Carbon::createFromDate($transaction->date),
                amount: Money::from($transaction->amount, $currency),
                memo: $transaction->memo,
                fitid: $transaction->uniqueId,
            )),
            bankAccount: new BankAccountData(
                type: AccountType::from(mb_strtolower((string) $bankAccount->accountType)),
                bankId: (string) $institute->id ?? $bankAccount->routingNumber,
                bankName: (string) $institute->name,
                agencyNumber: (string) $bankAccount->agencyNumber,
                number: (string) $bankAccount->accountNumber,
                balance: (float) $bankAccount->balance,
                balanceDate: Carbon::createFromDate($bankAccount->balanceDate)
            )
        );
    }
}
