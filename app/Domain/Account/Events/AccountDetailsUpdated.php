<?php

declare(strict_types=1);

namespace App\Domain\Account\Events;

use Spatie\EventSourcing\StoredEvents\ShouldBeStored;

final class AccountDetailsUpdated extends ShouldBeStored
{
    public function __construct(
        public string $accountId,
        public string $commanderId,
        public ?string $name = null,
        public ?string $color = null,
        public ?string $type = null,
        public ?string $number = null,
        public ?string $description = null,
        public ?string $bankCode = null,
    ) {}
}
