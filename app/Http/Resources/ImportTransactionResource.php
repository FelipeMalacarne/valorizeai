<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Enums\ImportTransactionStatus;
use App\Enums\TransactionType;
use App\ValueObjects\Money;
use Carbon\Carbon;
use Spatie\LaravelData\Attributes\Computed;
use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
final class ImportTransactionResource extends Data
{
    #[Computed]
    public string $amount_formatted;

    public function __construct(
        public string $id,
        public ImportTransactionStatus $status,
        public TransactionType $type,
        public Money $amount,
        public Carbon $date,
        public string $memo,
        public ?string $fitid,
        public ?CategoryResource $category,
        #[MapInputName('matchedTransaction')]
        public ?ImportMatchedTransactionResource $matched_transaction,
        public ?string $transaction_id,
        public Carbon $created_at,
    ) {
        $this->amount_formatted = $this->amount->format();
    }
}
