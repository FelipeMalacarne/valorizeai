<?php

declare(strict_types=1);

namespace App\Models;

use App\Casts\MoneyCast;
use App\Enums\AccountType;
use App\Enums\Color;
use App\Enums\Currency;
use App\ValueObjects\Money;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property string $id
 * @property string $name
 * @property Money $balance
 * @property Currency $currency
 * @property AccountType $type
 * @property string|null $number
 * @property string $user_id
 * @property string $bank_id
 * @property \Carbon\CarbonImmutable|null $created_at
 * @property \Carbon\CarbonImmutable|null $updated_at
 * @property-read Bank $bank
 * @property-read \Illuminate\Database\Eloquent\Collection<int, Transaction> $transactions
 * @property-read int|null $transactions_count
 * @property-read User $user
 *
 * @method static \Database\Factories\AccountFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Account newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Account newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Account query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Account whereBalance($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Account whereBankId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Account whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Account whereCurrency($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Account whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Account whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Account whereNumber($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Account whereType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Account whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Account whereUserId($value)
 *
 * @mixin \Eloquent
 */
final class Account extends Model
{
    /** @use HasFactory<\Database\Factories\AccountFactory> */
    use HasFactory, HasUuids;

    protected $attributes = [
        'balance' => 0,
    ];

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
        'balance'    => MoneyCast::class,
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
