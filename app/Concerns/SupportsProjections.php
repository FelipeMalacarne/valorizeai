<?php

namespace App\Concerns;

use Illuminate\Database\Eloquent\Factories\Factory;

trait SupportsProjections
{
    public function newModel(array $attributes = [])
    {
        return Factory::newModel([
            'id' => fake()->uuid(),
            ...$attributes,
        ])->writeable();
    }
}
