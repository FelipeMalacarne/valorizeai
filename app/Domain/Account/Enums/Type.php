<?php

declare(strict_types=1);

namespace App\Domain\Account\Enums;

enum Type: string
{
    case CHECKING = 'checking';
    case SAVINGS = 'savings';
    case SALARY = 'salary';
}
