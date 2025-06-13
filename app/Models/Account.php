<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\AccountType;
use App\Enums\Color;
use App\Enums\Currency;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

final class Account extends Model
{
    /** @use HasFactory<\Database\Factories\AccountFactory> */
    use HasFactory, HasUuids;

    protected $fillable = [
        'id',
        'name',
        'balance',
        'currency',
        'type',
        'number',
        'user_id',
        'bank_id',
    ];

    protected $casts = [
        'balance'    => 'integer',
        'currency'   => Currency::class,
        'type'       => AccountType::class,
        'created_at' => 'immutable_datetime',
        'updated_at' => 'immutable_datetime',
    ];

    // TODO: Elasticsearch
    // public function mappableAs(): array
    // {
    //     return [
    //         'id'          => 'keyword',
    //         'color'       => 'keyword',
    //         'user_id'     => 'keyword',
    //         'type'        => 'keyword',
    //         'number'      => 'keyword',
    //         'bank_code'   => 'keyword',
    //         'name'        => 'text',
    //         'balance'     => 'integer',
    //         'description' => 'text',
    //         'created_at'  => 'date',
    //         'updated_at'  => 'date',
    //     ];
    // }

    /**
     * @return BelongsTo<User,Account>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return BelongsTo<Bank,Account>
     */
    public function bank(): BelongsTo
    {
        return $this->belongsTo(Bank::class);
    }

    /**
     * @return HasMany<Transaction,Account>
     */
    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }
}
