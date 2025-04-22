<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\Currency;
use App\Enums\OrganizationRole;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

final class Organization extends Model
{
    /** @use HasFactory<\Database\Factories\OrganizationFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'preferred_currency',
    ];

    protected $casts = [
        'id'                 => 'string',
        'preferred_currency' => Currency::class,
    ];

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class)
            ->withPivot('role')
            ->withTimestamps()
            ->using(OrganizationUser::class);
    }

    public function addUser(User $user, OrganizationRole $role): void
    {
        $this->users()->attach($user->id, ['role' => $role]);
    }
}
