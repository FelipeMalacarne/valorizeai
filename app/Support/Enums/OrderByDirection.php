<?php

declare(strict_types=1);

namespace App\Support\Enums;

enum OrderByDirection: string
{
    case ASC = 'asc';
    case DESC = 'desc';
}
