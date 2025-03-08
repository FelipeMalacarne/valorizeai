<?php

declare(strict_types=1);

namespace App\Support\CQRS;

/**
 * @template T
 * @template Q of Query<T>
 */
interface QueryHandler
{
    // /**
    //  * We typically require implementing classes
    //  * to have a handle() method with exactly one parameter
    //  * (the query) but we won't enforce it here.
    //  * Reflection in the ServiceProvider will do the matching.
    //  */

    // /**
    //  * @param  Q  $query
    //  * @return T
    //  */
    // public function handle($query);
}
