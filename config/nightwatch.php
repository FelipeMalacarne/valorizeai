<?php

declare(strict_types=1);

return [
    'token' => env('NIGHTWATCH_TOKEN_FILE') ? file_get_contents(env('NIGHTWATCH_TOKEN_FILE')) : env('NIGHTWATCH_TOKEN'),
];
