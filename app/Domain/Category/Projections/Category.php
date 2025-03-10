<?php

declare(strict_types=1);

namespace App\Domain\Category\Projections;

use App\Concerns\HasV7Uuids;
use App\Domain\Account\Enums\Color;
use App\Domain\Transaction\Projections\Transaction;
use Database\Factories\CategoryFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Spatie\EventSourcing\Projections\Projection;

final class Category extends Projection
{
    /** @use HasFactory<\Database\Factories\CategoryFactory> */
    use HasFactory, HasV7Uuids;

    protected $fillable = [
        'id',
        'name',
        'color',
        'is_default',
        'user_id',
    ];

    public static function newFactory(): Factory
    {
        return CategoryFactory::new();
    }

    /**
     * @return BelongsToMany<Transaction,Category>
     */
    public function transactions(): BelongsToMany
    {
        return $this->belongsToMany(Transaction::class);
    }

    /**
     * @param  Builder<Model>  $query
     */
    public function scopeDefault(Builder $query): Builder
    {
        return $query->where('is_default', true);
    }

    /**
     * @param  Builder<Model>  $query
     */
    public function scopeWhereUser(Builder $query, string $userId): Builder
    {
        return $query->default()->orWhere('user_id', $userId);
    }

    protected function casts(): array
    {
        return [
            'color'      => Color::class,
            'is_default' => 'boolean',
            'updated_at' => 'immutable_datetime',
            'created_at' => 'immutable_datetime',
        ];
    }
}
