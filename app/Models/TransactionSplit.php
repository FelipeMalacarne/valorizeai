<?php

declare(strict_types=1);

namespace App\Models;

use App\ValueObjects\Money;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property string $id
 * @property string $transaction_id
 * @property string|null $category_id
 * @property Money $amount
 * @property string|null $memo
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read Category|null $category
 * @property-read mixed $date
 * @property-read Transaction $transaction
 *
 * @method static \Database\Factories\TransactionSplitFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TransactionSplit newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TransactionSplit newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TransactionSplit query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TransactionSplit whereAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TransactionSplit whereCategoryId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TransactionSplit whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TransactionSplit whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TransactionSplit whereMemo($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TransactionSplit whereTransactionId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TransactionSplit whereUpdatedAt($value)
 *
 * @mixin \Eloquent
 */
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
