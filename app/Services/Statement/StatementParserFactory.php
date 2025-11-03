<?php

declare(strict_types=1);

namespace App\Services\StatementParser;

use App\Services\StatementParser\Parsers\CsvStatementParser;
use App\Services\StatementParser\Parsers\OfxStatementParser;
use InvalidArgumentException;

final class StatementParserFactory
{
    public function create(string $fileType): StatementParser
    {
        return match ($fileType) {
            'ofx'   => new OfxStatementParser(),
            'csv'   => new CsvStatementParser(),
            default => throw new InvalidArgumentException("Unsupported file type: {$fileType}"),
        };
    }
}
