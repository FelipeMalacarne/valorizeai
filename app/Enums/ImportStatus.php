<?php

declare(strict_types=1);

namespace App\Enums;

enum ImportStatus: string
{
    case PROCESSING = 'processing';
    case PENDING_REVIEW = 'pending_review';
    case APPROVED = 'approved';
    case REFUSED = 'refused';
    case COMPLETED = 'completed';
    case FAILED = 'failed';
}
