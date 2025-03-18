#!/usr/bin/env bash
set -e

if [[ "$APP_ENV" == "dev" ]] ; then
    cp /usr/local/etc/php/php.ini-development /usr/local/etc/php/php.ini
else
    cp /usr/local/etc/php/php.ini-production /usr/local/etc/php/php.ini
fi

php bin/console secrets:decrypt-to-local
COMPOSER_ALLOW_SUPERUSER=1 composer dump-env $APP_ENV

# Ensure the cache directory is clean and writable to the webserver user
php bin/console cache:clear
chown -R www-data var

if [[ "$APP_ENV" == "dev" ]] ; then
    exec php-fpm
else
    exec symfony server:start --no-tls --port=8080
fi
