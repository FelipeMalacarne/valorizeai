<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

final class Bank extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'id',
        'name',
        'code',
    ];

    public function accounts(): HasMany
    {
        return $this->hasMany(Account::class);
    }
}
