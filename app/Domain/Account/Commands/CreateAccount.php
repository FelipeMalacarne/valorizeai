<?php

declare(strict_types=1);

namespace App\Domain\Account\Commands;

use App\Domain\Account\AccountAggregate;
use App\Domain\Account\Enums\Color;
use App\Domain\Account\Enums\Type;
use Illuminate\Support\Str;
use Spatie\EventSourcing\Commands\AggregateUuid;
use Spatie\EventSourcing\Commands\HandledBy;
use Spatie\LaravelData\Attributes\Computed;
use Spatie\LaravelData\Attributes\FromAuthenticatedUserProperty;
use Spatie\LaravelData\Attributes\Validation\Digits;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Attributes\Validation\Nullable;
use Spatie\LaravelData\Attributes\Validation\Numeric;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;

#[HandledBy(AccountAggregate::class)]
final class CreateAccount extends Data
{
    public function __construct(

        #[Computed]
        #[AggregateUuid]
        public ?string $id,

        #[FromAuthenticatedUserProperty(property: 'id')]
        public string $user_id,

        #[Min(3)]
        #[Max(255)]
        public string $name,

        #[Numeric]
        #[Digits(3)]
        public string $bank_code,

        #[Max(255)]
        #[Nullable]
        public Optional|null|string $description = null,

        #[Max(16)]
        #[Nullable]
        public ?string $number,

        public Color $color,
        public Type $type,
    ) {
        $this->id = $this->id ?? Str::uuid7()->toString();
    }
}
