#!/usr/bin/env bash

php artisan optimize
php artisan storage:link

exec php artisan octane:frankenphp --host=0.0.0.0 --port=8000
