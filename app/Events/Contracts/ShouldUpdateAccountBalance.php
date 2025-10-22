<?php

declare(strict_types=1);

namespace App\Events\Contracts;

use App\ValueObjects\Money;

interface ShouldUpdateAccountBalance
{
    public function accountId(): string;

    public function amount(): Money;
}
