<?php

namespace App\Models;

use App\Enums\Color;
use Illuminate\Database\Eloquent\Concerns\HasVersion7Uuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use JeroenG\Explorer\Application\Explored;
use Laravel\Scout\Searchable;

class Account extends Model implements Explored
{
    /** @use HasFactory<\Database\Factories\AccountFactory> */
    use HasFactory, HasVersion7Uuids, Searchable;

    protected $fillable = [
        'name',
        'balance',
        'type',
        'number',
        'description',
        'color',
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
}
