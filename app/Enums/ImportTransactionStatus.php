<?php

declare(strict_types=1);

namespace App\Enums;

enum ImportTransactionStatus: string
{
    case PENDING = 'pending';
    case MATCHED = 'matched';
    case CONFLICTED = 'conflicted';
    case REFUSED = 'refused';
    case NEW = 'new';
    case APPROVED = 'approved';
    case REJECTED = 'rejected';
}
