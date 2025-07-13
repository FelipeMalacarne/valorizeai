<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\ValueObjects\Money;
use Spatie\LaravelData\Attributes\Computed;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
final class TransactionSplitResource extends Data
{
    #[Computed]
    public string $amount_formatted;

    public function __construct(
        public string $id,
        public Money $amount,
        public ?string $memo,
        public CategoryResource $category,
    ) {
        $this->amount_formatted = $this->amount->format();
    }
}
