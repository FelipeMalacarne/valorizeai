<?php

declare(strict_types=1);

namespace App\Models;

use App\Casts\MoneyCast;
use App\Enums\Currency;
use App\Enums\ImportTransactionStatus;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property string $id
 * @property string $import_id
 * @property string|null $matched_transaction_id
 * @property string|null $category_id
 * @property ImportTransactionStatus $status
 * @property string|null $fitid
 * @property string $memo
 * @property Currency $currency
 * @property \App\ValueObjects\Money $amount
 * @property \Illuminate\Support\Carbon $date
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read Import $import
 * @property-read Transaction|null $matchedTransaction
 * @property-read Category|null $category
 */
final class ImportTransaction extends Model
{
    /** @use HasFactory<\Database\Factories\ImportTransactionFactory> */
    use HasFactory, HasUuids;

    protected $fillable = [
        'import_id',
        'matched_transaction_id',
        'category_id',
        'status',
        'fitid',
        'memo',
        'currency',
        'amount',
        'date',
    ];

    /**
     * @return BelongsTo<Import, ImportTransaction>
     */
    public function import(): BelongsTo
    {
        return $this->belongsTo(Import::class);
    }

    /**
     * @return BelongsTo<Transaction, ImportTransaction>
     */
    public function matchedTransaction(): BelongsTo
    {
        return $this->belongsTo(Transaction::class, 'matched_transaction_id');
    }

    /**
     * @return BelongsTo<Category, ImportTransaction>
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    protected function casts(): array
    {
        return [
            'status'   => ImportTransactionStatus::class,
            'currency' => Currency::class,
            'amount'   => MoneyCast::class,
            'date'     => 'datetime',
        ];
    }
}
