<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\Color;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

/**
 * @property string $id
 * @property string $name
 * @property string|null $description
 * @property Color $color
 * @property bool $is_default
 * @property string|null $user_id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read User|null $user
 *
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Category default()
 * @method static \Database\Factories\CategoryFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Category newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Category newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Category query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Category whereColor($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Category whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Category whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Category whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Category whereIsDefault($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Category whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Category whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Category whereUser(string $user_id)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Category whereUserId($value)
 *
 * @property-read Budget|null $budget
 *
 * @mixin \Eloquent
 */
final class Category extends Model
{
    /** @use HasFactory<\Database\Factories\CategoryFactory> */
    use HasFactory, HasUuids;

    public const SPLIT_CATEGORY_NAME = 'Split Transactions';

    protected $fillable = [
        'name',
        'description',
        'color',
        'is_default',
        'user_id',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function scopeDefault($query): void
    {
        $query->where('is_default', true);
    }

    public function scopeOwnedBy($query, string $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeForUser($query, string $userId)
    {
        return $query->where(function ($inner) use ($userId) {
            $inner->whereNull('user_id')
                ->orWhere('user_id', $userId);
        });
    }

    public function scopeWhereUser($query, string $userId)
    {
        return $this->scopeForUser($query, $userId);
    }

    /**
     * @return HasOne<Budget,Category>
     */
    public function budget(): HasOne
    {
        return $this->hasOne(Budget::class);
    }

    protected function casts(): array
    {
        return [
            'color'      => Color::class,
            'is_default' => 'boolean',
        ];
    }
}
