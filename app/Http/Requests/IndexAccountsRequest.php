<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
final class IndexAccountsRequest extends Data
{
    public function __construct(
        public ?string $search = null,
    ) {}
}
