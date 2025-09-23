<?php

declare(strict_types=1);

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'ses' => [
        'key'    => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'resend' => [
        'key' => env('RESEND_API_KEY_FILE') ? file_get_contents(env('RESEND_API_KEY_FILE')) : env('RESEND_API_KEY'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel'              => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    'typesense' => [
        'api_key' => env('TYPESENSE_API_KEY_FILE') ? file_get_contents(env('TYPESENSE_API_KEY_FILE')) : env('TYPESENSE_API_KEY'),
        'nodes'   => [
            [
                'host'     => env('TYPESENSE_HOST', 'localhost'),
                'port'     => env('TYPESENSE_PORT', '8108'),
                'protocol' => env('TYPESENSE_PROTOCOL', 'http'),
            ],
        ],
        'connection_timeout_seconds' => 2,
    ],

];
