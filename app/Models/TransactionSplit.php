<?php

declare(strict_types=1);

namespace App\Models;

use App\ValueObjects\Money;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

final class TransactionSplit extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'amount',
        'memo',
        'category_id',
        'transaction_id',
    ];

    public function transaction(): BelongsTo
    {
        return $this->belongsTo(Transaction::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Get the amount as a Money Value Object.
     */
    protected function amount(): Attribute
    {
        return Attribute::make(
            get: fn (int $value) => new Money($value, $this->transaction->currency),
            set: fn (Money $value) => $value->value,
        );
    }

    protected function date(): Attribute
    {
        return Attribute::make(
            get: fn (DateTimeImmutable $value) => $this->transaction->date
        );
    }
}
