<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Carbon\Carbon;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;
use Spatie\TypeScriptTransformer\Attributes\TypeScriptType;

#[TypeScript]
final class TokenResource extends Data
{
    public function __construct(
        public string $id,
        public string $name,
        #[TypeScriptType('string[]')]
        public array $abilities,
        public ?Carbon $lastUsedAt,
        public ?Carbon $expiresAt,
        public Carbon $createdAt,
    ) {}
}
