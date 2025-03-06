<?php

declare(strict_types=1);

namespace App\Models;

use App\Domain\Account\Projections\Account;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Concerns\HasVersion7Uuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

/**
 * @mixin \Illuminate\Database\Eloquent\Builder
 *
 * @method static \Illuminate\Database\Eloquent\Builder|static query()
 * @method static static make(array $attributes = [])
 * @method static static create(array $attributes = [])
 * @method static static forceCreate(array $attributes)
 * @method \App\Models\User firstOrNew(array $attributes = [], array $values = [])
 * @method \App\Models\User firstOrFail($columns = ['*'])
 * @method \App\Models\User firstOrCreate(array $attributes, array $values = [])
 * @method \App\Models\User firstOr($columns = ['*'], \Closure $callback = null)
 * @method \App\Models\User firstWhere($column, $operator = null, $value = null, $boolean = 'and')
 * @method \App\Models\User updateOrCreate(array $attributes, array $values = [])
 * @method null|static first($columns = ['*'])
 * @method static static findOrFail($id, $columns = ['*'])
 * @method static static findOrNew($id, $columns = ['*'])
 * @method static null|static find($id, $columns = ['*'])
 */
final class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, HasVersion7Uuids, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * @return HasMany<Account,User>
     */
    public function accounts(): HasMany
    {
        return $this->hasMany(Account::class);
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password'          => 'hashed',
        ];
    }
}
