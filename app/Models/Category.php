<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\Color;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

final class Category extends Model
{
    /** @use HasFactory<\Database\Factories\CategoryFactory> */
    use HasFactory, HasUuids;

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

    public function scopeWhereUser($query, string $user_id): void
    {
        $query->where(function ($query) use ($user_id) {
            $query->where('user_id', $user_id)
                ->orWhereNull('user_id');
        });
    }

    protected function casts(): array
    {
        return [
            'color'      => Color::class,
            'is_default' => 'boolean',
        ];
    }
}
