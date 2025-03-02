<?php

declare(strict_types=1);

namespace App\Domain\Category\Projections;

use App\Concerns\HasV7Uuids;
use App\Domain\Account\Enums\Color;
use App\Domain\Transaction\Projections\Transaction;
use Illuminate\Database\Eloquent\Factories\HasFactory;
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
        'description',
        'is_default',
        'user_id',
    ];

    /**
     * @return BelongsToMany<Transaction,Category>
     */
    public function transactions(): BelongsToMany
    {
        return $this->belongsToMany(Transaction::class);
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
