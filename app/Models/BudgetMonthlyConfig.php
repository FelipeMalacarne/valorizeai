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
 * @property string $user_id
 * @property \Carbon\CarbonImmutable $month
 * @property int $income_amount
 * @property \Carbon\CarbonImmutable|null $created_at
 * @property \Carbon\CarbonImmutable|null $updated_at
 *
 * @property-read User $user
 *
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BudgetMonthlyConfig newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BudgetMonthlyConfig newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BudgetMonthlyConfig query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BudgetMonthlyConfig whereUserId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BudgetMonthlyConfig whereMonth($value)
 *
 * @mixin \Eloquent
 */
final class BudgetMonthlyConfig extends Model
{
    /** @use HasFactory<\Database\Factories\BudgetMonthlyConfigFactory> */
    use HasFactory, HasUuids;

    protected $fillable = [
        'user_id',
        'month',
        'income_amount',
    ];

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

    /**
     * @return BelongsTo<User,BudgetMonthlyConfig>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public static function forUserAndMonth(string $userId, CarbonImmutable $month): ?self
    {
        return static::query()
            ->where('user_id', $userId)
            ->whereDate('month', '<=', $month->toDateString())
            ->orderByDesc('month')
            ->first();
    }

    public function remainingIncome(int $allocatedExcludingCurrent): int
    {
        return (int) $this->income_amount - $allocatedExcludingCurrent;
    }
}
