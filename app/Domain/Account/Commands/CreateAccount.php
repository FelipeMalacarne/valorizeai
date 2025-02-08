<?php

namespace App\Domain\Account\Commands;

use App\Domain\Account\AccountAggregate;
use App\Domain\Account\Enums\Color;
use App\Domain\Account\Enums\Type;
use Spatie\EventSourcing\Commands\AggregateUuid;
use Spatie\EventSourcing\Commands\HandledBy;

#[HandledBy(AccountAggregate::class)]
class CreateAccount
{
    public function __construct(
        #[AggregateUuid] public string $id,
        public string $name,
        public Color $color,
        public string $userId,
        public Type $type,
        public string $bankCode,
        public ?string $description = null,
        public ?string $number = null,
    ) {}
}
