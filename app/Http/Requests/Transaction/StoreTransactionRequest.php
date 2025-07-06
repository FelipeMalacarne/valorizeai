<?php

declare(strict_types=1);

namespace App\Http\Requests\Transaction;

use App\Enums\TransactionType;
use App\ValueObjects\Money;
use Carbon\Carbon;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\WithData;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
final class StoreTransactionRequest extends Data
{
    use WithData;

    public function __construct(
        public string $account_id,
        public ?string $category_id,
        public Money $amount,
        public TransactionType $type,
        public Carbon $date,
        public ?string $memo = null
    ) {}

    public static function rules(): array
    {
        return [
            'account_id'      => ['required', 'uuid', 'exists:accounts,id'],
            'category_id'     => ['nullable', 'uuid', 'exists:categories,id'],
            'amount'          => ['required', 'array'],
            'amount.amount'   => ['required', 'integer'],
            'amount.currency' => ['required', 'string'],
            'type'            => ['required', 'in:debit,credit'],
            'date'            => ['required', 'date'],
            'memo'            => ['nullable', 'string', 'max:255'],
        ];
    }
}
