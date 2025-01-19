<?php

namespace App\Concerns;

use Illuminate\Database\Eloquent\Concerns\HasVersion7Uuids;

trait HasV7Uuids
{
    use HasVersion7Uuids;

    public function getKeyName()
    {
        return 'id';
    }

    public function getRouteKeyName()
    {
        return 'id';
    }
}
