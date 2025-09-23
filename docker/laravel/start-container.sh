#!/usr/bin/env sh

set -e

php artisan optimize
php artisan storage:link

# If a command is passed to the script, run it.
# Otherwise, run the default command.
if [ "$#" -gt 0 ]; then
    exec "$@"
else
    exec php artisan octane:frankenphp --host=0.0.0.0 --port=8080
fi
