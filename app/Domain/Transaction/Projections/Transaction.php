<?php

declare(strict_types=1);

namespace App\Domain\Transaction\Projections;

use App\Concerns\HasV7Uuids;
use App\Domain\Account\Projections\Account;
use App\Domain\Category\Projections\Category;
use App\Domain\Transaction\Concerns\SearchesTransactions;
use Database\Factories\TransactionFactory;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Number;
use JeroenG\Explorer\Application\Explored;
use Spatie\EventSourcing\Projections\Projection;

final class Transaction extends Projection implements Explored
{
    /** @use HasFactory<\Database\Factories\TransactionFactory> */
    use HasFactory, HasV7Uuids, SearchesTransactions;

    protected $fillable = [
        'id',
        'amount',
        'date_posted',
        'fitid',
        'memo',
        'currency',
        'account_number',
        'account_id',
        'description',
    ];

    protected $dates = [
        'created_at',
        'updated_at',
        'date_posted',
    ];

    public static function newFactory(): Factory
    {
        return TransactionFactory::new();
    }

    /**
     * @return BelongsTo<Account,Transaction>
     */
    public function account(): BelongsTo
    {
        return $this->belongsTo(Account::class);
    }

    /**
     * @return BelongsToMany<Category,Transaction>
     */
    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(Category::class);
    }

    protected function casts(): array
    {
        return [
            'date_posted' => 'datetime',
            'created_at'  => 'immutable_datetime',
            'updated_at'  => 'immutable_datetime',
        ];
    }

    protected function money(): Attribute
    {
        return Attribute::make(
            get: fn () => Number::currency($this->amount, $this->currency)
        );
    }
}
