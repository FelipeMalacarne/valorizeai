<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Enums\TransactionType;
use App\ValueObjects\Money;
use Carbon\Carbon;
use Illuminate\Support\Number;
use Spatie\LaravelData\Attributes\Computed;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
final class TransactionResource extends Data
{
    #[Computed]
    public string $amount_formatted;

    public function __construct(
        public string $id,
        public Money $amount,
        public ?string $fitid,
        public ?string $memo,
        public TransactionType $type,
        public Carbon $date,
        public ?CategoryResource $category,
        public AccountResource $account
    ) {
        $this->amount_formatted = $this->amount->format();
    }
}
