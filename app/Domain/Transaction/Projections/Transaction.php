<?php

namespace App\Domain\Transaction\Projections;

use App\Concerns\HasV7Uuids;
use App\Domain\Account\Projections\Account;
use Database\Factories\TransactionFactory;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use JeroenG\Explorer\Application\Explored;
use Laravel\Scout\Searchable;
use Spatie\EventSourcing\Projections\Projection;

class Transaction extends Projection implements Explored
{
    /** @use HasFactory<\Database\Factories\TransactionFactory> */
    use HasFactory, HasV7Uuids, Searchable;

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

    protected function casts(): array
    {
        return [
            'date_posted' => 'datetime',
            'created_at'  => 'immutable_datetime',
            'updated_at'  => 'immutable_datetime',
        ];
    }

    public function mappableAs(): array
    {
        return [
            'id'             => 'keyword',
            'fitid'          => 'keyword',
            'account_id'     => 'keyword',
            'account_number' => 'keyword',
            'currency'       => 'keyword',
            'amount'         => 'integer',
            'memo'           => 'text',
            'description'    => 'text',
            'date_posted'    => 'date',
            'created_at'     => 'date',
            'updated_at'     => 'date',
        ];
    }

    public static function newFactory(): Factory
    {
        return TransactionFactory::new();
    }

    public function account()
    {
        return $this->belongsTo(Account::class);
    }
}
