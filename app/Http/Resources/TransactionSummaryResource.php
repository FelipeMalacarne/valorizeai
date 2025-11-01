<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\ValueObjects\Money;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
final class TransactionSummaryResource extends Data
{
    public function __construct(
        public Money $balance,
        public Money $credits,
        public Money $debits,
    ) {}
}
