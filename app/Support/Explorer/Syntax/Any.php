<?php

declare(strict_types=1);

namespace App\Support\Explorer\Syntax;

use JeroenG\Explorer\Domain\Syntax\Compound\BoolQuery;

final class Any extends BoolQuery
{
    public function __construct(
        /*
        * @var JeroenG\Explorer\Domain\Syntax\SyntaxInterface[] $conditions
        **/
        protected array $conditions,
    ) {
        parent::__construct();

        foreach ($conditions as $condition) {
            $this->should($condition);
        }

        $this->minimumShouldMatch('1');
    }
}
