<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Enums\TransactionType;
use App\ValueObjects\Money;
use Carbon\Carbon;
use Spatie\LaravelData\Attributes\Computed;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
final class ImportMatchedTransactionResource extends Data
{
    #[Computed]
    public string $amount_formatted;

    public function __construct(
        public string $id,
        public Money $amount,
        public TransactionType $type,
        public Carbon $date,
        public ?string $memo,
    ) {
        $this->amount_formatted = $this->amount->format();
    }
}
