<?php

declare(strict_types=1);

namespace App\Models;

use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property string $id
 * @property string $budget_id
 * @property CarbonImmutable $month
 * @property int $budgeted_amount
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 * @property-read Budget $budget
 *
 * @method static \Database\Factories\BudgetAllocationFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BudgetAllocation newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BudgetAllocation newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BudgetAllocation query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BudgetAllocation whereBudgetId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BudgetAllocation whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BudgetAllocation whereMonth($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BudgetAllocation whereBudgetedAmount($value)
 *
 * @mixin \Eloquent
 */
final class BudgetAllocation extends Model
{
    /** @use HasFactory<\Database\Factories\BudgetAllocationFactory> */
    use HasFactory, HasUuids;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'budget_id',
        'month',
        'budgeted_amount',
    ];

    /**
     * @return BelongsTo<Budget,BudgetAllocation>
     */
    public function budget(): BelongsTo
    {
        return $this->belongsTo(Budget::class);
    }

    public function scopeForMonth($query, CarbonImmutable $month): void
    {
        $query->where('month', $month->startOfMonth());
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'month'      => 'immutable_date',
            'created_at' => 'immutable_datetime',
            'updated_at' => 'immutable_datetime',
        ];
    }
}
