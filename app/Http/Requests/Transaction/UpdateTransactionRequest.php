<?php

declare(strict_types=1);

namespace App\Http\Requests\Transaction;

use App\Casts\MoneyCast;
use App\Enums\TransactionType;
use App\ValueObjects\Money;
use Carbon\Carbon;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Casts\DateTimeInterfaceCast;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\WithData;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
final class UpdateTransactionRequest extends Data
{
    use WithData;

    public function __construct(
        #[WithCast(MoneyCast::class)]
        public Money $amount,
        public TransactionType $type,
        #[WithCast(DateTimeInterfaceCast::class, timeZone: 'UTC')]
        public Carbon $date,
        public ?string $memo = null,
        public ?string $category_id = null,
    ) {}

    public static function rules(): array
    {
        return [
            'amount'          => ['required', 'array'],
            'amount.value'    => ['required', 'integer'],
            'amount.currency' => ['required', 'string'],
            'type'            => ['required', 'in:debit,credit'],
            'date'            => ['required', 'date'],
            'memo'            => ['nullable', 'string', 'max:255'],
            'category_id'     => ['nullable', 'uuid', 'exists:categories,id'],
        ];
    }
}
