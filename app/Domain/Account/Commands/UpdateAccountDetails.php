<?php

namespace App\Domain\Account\Commands;

use App\Domain\Account\AccountAggregate;
use App\Domain\Account\Enums\Color;
use App\Domain\Account\Enums\Type;
use Spatie\EventSourcing\Commands\AggregateUuid;
use Spatie\EventSourcing\Commands\HandledBy;

#[HandledBy(AccountAggregate::class)]
class UpdateAccountDetails
{
    public function __construct(
        #[AggregateUuid] public string $accountId,
        public string $commanderId,
        public ?string $name = null,
        public ?Color $color = null,
        public ?Type $type = null,
        public ?string $number = null,
        public ?string $description = null,
        public ?string $bankCode = null,
    ) {}
}
