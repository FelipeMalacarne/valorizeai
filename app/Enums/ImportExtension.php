<?php

declare(strict_types=1);

namespace App\Enums;

enum ImportExtension: string
{
    case OFX = 'ofx';
    case CSV = 'csv';
}
