<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\Currency;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property string $id
 * @property string $name
 * @property Currency $currency
 * @property string $user_id
 * @property string $category_id
 * @property \Carbon\CarbonImmutable|null $created_at
 * @property \Carbon\CarbonImmutable|null $updated_at
 * @property-read User $user
 * @property-read Category $category
 * @property-read \Illuminate\Database\Eloquent\Collection<int, BudgetAllocation> $allocations
 * @property-read int|null $allocations_count
 *
 * @method static \Database\Factories\BudgetFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Budget newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Budget newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Budget query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Budget whereCategoryId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Budget whereCurrency($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Budget whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Budget whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Budget whereUserId($value)
 *
 * @mixin \Eloquent
 */
final class Budget extends Model
{
    /** @use HasFactory<\Database\Factories\BudgetFactory> */
    use HasFactory, HasUuids;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'currency',
        'user_id',
        'category_id',
    ];

    /**
     * @return BelongsTo<User,Budget>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return BelongsTo<Category,Budget>
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * @return HasMany<BudgetAllocation,Budget>
     */
    public function allocations(): HasMany
    {
        return $this->hasMany(BudgetAllocation::class);
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'currency'   => Currency::class,
            'created_at' => 'immutable_datetime',
            'updated_at' => 'immutable_datetime',
        ];
    }
}
