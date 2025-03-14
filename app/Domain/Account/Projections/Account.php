<?php

declare(strict_types=1);

namespace App\Domain\Account\Projections;

use App\Concerns\HasV7Uuids;
use App\Domain\Account\Enums\Color;
use App\Domain\Account\Enums\Type;
use App\Domain\Transaction\Projections\Transaction;
use App\Models\User;
use Database\Factories\AccountFactory;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use JeroenG\Explorer\Application\Explored;
use Laravel\Scout\Searchable;
use Spatie\EventSourcing\Projections\Projection;

final class Account extends Projection implements Explored
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
        'bank_code',
        'color',
        'user_id',
    ];

    public static function newFactory(): Factory
    {
        return AccountFactory::new();
    }

    public function mappableAs(): array
    {
        return [
            'id'          => 'keyword',
            'color'       => 'keyword',
            'user_id'     => 'keyword',
            'type'        => 'keyword',
            'number'      => 'keyword',
            'bank_code'   => 'keyword',
            'name'        => 'text',
            'balance'     => 'integer',
            'description' => 'text',
            'created_at'  => 'date',
            'updated_at'  => 'date',
        ];
    }

    /**
     * @return HasMany<Transaction,Account>
     */
    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }

    /**
     * @return BelongsTo<User,Account>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    protected function casts(): array
    {
        return [
            'balance'    => 'integer',
            'color'      => Color::class,
            'type'       => Type::class,
            'updated_at' => 'immutable_datetime',
            'created_at' => 'immutable_datetime',
        ];
    }
}
