<?php

declare(strict_types=1);

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
