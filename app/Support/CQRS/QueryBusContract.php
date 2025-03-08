<?php

declare(strict_types=1);

namespace App\Support\CQRS;

interface QueryBusContract
{
    /**
     * Dispatches the given query to its corresponding handler.
     */
    public function dispatch(object $query): mixed;
}
