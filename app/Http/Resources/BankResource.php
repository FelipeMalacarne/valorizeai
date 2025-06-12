<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript()]
final class BankResource extends Data
{
    public function __construct(
        public string $id,
        public string $code,
        public string $name,
    ) {}
}
