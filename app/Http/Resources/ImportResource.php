<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Enums\ImportExtension;
use App\Enums\ImportStatus;
use Carbon\Carbon;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
final class ImportResource extends Data
{
    public function __construct(
        public string $id,
        public ImportStatus $status,
        public ImportExtension $extension,
        public string $file_name,
        public int $new_count,
        public int $matched_count,
        public int $conflicted_count,
        public int $pending_transactions = 0,
        public int $approved_transactions = 0,
        public int $rejected_transactions = 0,
        public Carbon $created_at,
        public ?Carbon $updated_at,
        public ?AccountResource $account,
    ) {}
}
