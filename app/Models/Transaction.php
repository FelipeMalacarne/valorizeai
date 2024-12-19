<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasVersion7Uuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use JeroenG\Explorer\Application\Explored;
use Laravel\Scout\Searchable;

class Transaction extends Model implements Explored
{
    /** @use HasFactory<\Database\Factories\TransactionFactory> */
    use HasFactory, HasVersion7Uuids, Searchable;

    protected $fillable = [
        'amount',
        'date_posted',
        'fitid',
        'memo',
        'currency',
        'account_number',
        'account_id',
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
            'date_posted'    => 'date',
            'created_at'     => 'date',
            'updated_at'     => 'date',
        ];
    }

    public function account()
    {
        return $this->belongsTo(Account::class);
    }
}
