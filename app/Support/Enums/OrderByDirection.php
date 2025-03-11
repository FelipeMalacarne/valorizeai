<?php

declare(strict_types=1);

namespace App\Support\Enums;

use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
enum OrderByDirection: string
{
    case ASC = 'asc';
    case DESC = 'desc';
}
