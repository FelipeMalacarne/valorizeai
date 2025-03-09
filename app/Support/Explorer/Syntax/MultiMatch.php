<?php

declare(strict_types=1);

namespace App\Support\Explorer\Syntax;

use App\Support\Explorer\Enums\MultiMatchType;
use JeroenG\Explorer\Domain\Syntax\MultiMatch as ExplorerMultiMatch;

final class MultiMatch extends ExplorerMultiMatch
{
    private MultiMatchType $type;

    public function __construct(
        string $value,
        ?array $fields = null,
        string $fuzziness = 'auto',
        int $prefix_length = 0,
        MultiMatchType $type = MultiMatchType::BEST_FIELDS
    ) {
        parent::__construct($value, $fields, $fuzziness, $prefix_length);
        $this->type = $type;
    }

    public function build(): array
    {
        $query = parent::build()['multi_match'];

        $query['type'] = $this->type;

        return ['multi_match' => $query];
    }
}
