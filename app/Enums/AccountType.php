<?php

declare(strict_types=1);

namespace App\Enums;

enum AccountType: string
{
    case CHECKING = 'checking';
    case SAVINGS = 'savings';
    case INVESTMENT = 'investment';
    case CREDIT = 'credit';
}
