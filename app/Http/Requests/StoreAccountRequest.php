<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Enums\AccountType;
use App\Enums\Color;
use App\Enums\Currency;
use App\Models\Organization;
use Spatie\LaravelData\Attributes\FromRouteParameter;
use Spatie\LaravelData\Data;

final class StoreAccountRequest extends Data
{
    public function __construct(
        public string $name,
        public string $bank_code,
        public Currency $currency,
        public Color $color,
        public AccountType $type,
        public ?string $description,

        #[FromRouteParameter('organization')]
        public Organization $oganization,
    ) {}

    public static function rules(): array
    {
        return [
            'name'         => ['required', 'string', 'min:3', 'max:255'],
            'bank_code'    => ['numeric',  'digits:3'],
            'organization' => ['required', 'exists:organizations,id'],
        ];
    }
}
