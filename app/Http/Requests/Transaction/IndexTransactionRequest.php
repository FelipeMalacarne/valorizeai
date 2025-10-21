<?php

declare(strict_types=1);

namespace App\Http\Requests\Transaction;

use App\Data\OrderBy;
use App\Enums\TransactionType;
use Carbon\Carbon;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class IndexTransactionRequest extends Data
{
    public function __construct(
        public ?string $search = null,
        /** @var string[] */
        public array $categories = [],
        /** @var string[] */
        public array $accounts = [],
        public ?Carbon $start_date = null,
        public ?Carbon $end_date = null,
        public ?OrderBy $order_by = null,
        public ?TransactionType $type = null,
        public int $page = 1,
        public int $per_page = 15,
    ) {}

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public static function rules(): array
    {
        return [
            'search'     => ['nullable', 'string', 'max:255'],
            'category'   => ['nullable', 'exists:categories,id'],
            'accounts'   => ['array'],
            'accounts.*' => ['string', 'exists:accounts,id'],
            'start_date' => ['nullable', 'date'],
            'end_date'   => ['nullable', 'date'],
            'page'       => ['integer', 'min:1'],
            'per_page'   => ['integer', 'min:1', 'max:100'],
        ];
    }
}
