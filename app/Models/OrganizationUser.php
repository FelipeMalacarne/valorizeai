<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\OrganizationRole;
use Illuminate\Database\Eloquent\Relations\Pivot;

final class OrganizationUser extends Pivot
{
    protected $fillable = [
        'role',
    ];

    protected $casts = [
        'role' => OrganizationRole::class,
    ];
}
