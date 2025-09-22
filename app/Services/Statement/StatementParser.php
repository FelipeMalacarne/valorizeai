<?php

declare(strict_types=1);

namespace App\Services\Statement;

use App\Services\Statement\Data\StatementData;

interface StatementParser
{
    public function parse(string $content): StatementData;
}
