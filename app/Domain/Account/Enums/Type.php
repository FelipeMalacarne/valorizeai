<?php

namespace App\Domain\Account\Enums;

enum Type: string
{
    case CHECKING = 'checking';
    case SAVINGS = 'savings';
    case SALARY = 'salary';
}
