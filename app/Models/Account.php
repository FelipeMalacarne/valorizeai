<?php

namespace App\Models;

use App\Enums\Color;
use Illuminate\Database\Eloquent\Concerns\HasVersion7Uuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Account extends Model
{
    /** @use HasFactory<\Database\Factories\AccountFactory> */
    use HasFactory, HasVersion7Uuids;

    protected $fillable = [
        'name',
        'balance',
        'type',
        'number',
        'description',
        'color',
    ];

    protected $casts = [
        'balance' => 'integer',
        'color' => Color::class,
        'updated_at' => 'immutable_datetime',
        'created_at' => 'immutable_datetime',
    ];
}
