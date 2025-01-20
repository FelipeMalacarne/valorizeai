<?php

namespace App\Models;

use App\Concerns\HasV7Uuids;
use App\Enums\Color;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use JeroenG\Explorer\Application\Explored;
use Laravel\Scout\Searchable;
use Spatie\EventSourcing\Projections\Projection;

class Account extends Projection implements Explored
{
    /** @use HasFactory<\Database\Factories\AccountFactory> */
    use HasFactory, HasV7Uuids, Searchable;

    protected $fillable = [
        'id',
        'name',
        'balance',
        'type',
        'number',
        'description',
        'color',
        'user_id',
    ];

    protected function casts(): array
    {
        return [
            'balance'    => 'integer',
            'color'      => Color::class,
            'updated_at' => 'immutable_datetime',
            'created_at' => 'immutable_datetime',
        ];
    }

    public function mappableAs(): array
    {
        return [
            'id'          => 'keyword',
            'name'        => 'text',
            'balance'     => 'integer',
            'type'        => 'keyword',
            'number'      => 'keyword',
            'description' => 'text',
            'color'       => 'keyword',
            'created_at'  => 'date',
            'updated_at'  => 'date',
        ];
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
