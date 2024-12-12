#!/usr/bin/env bash
set -e

if [[ "$APP_ENV" == "dev" ]] ; then
    cp /usr/local/etc/php/php.ini-development /usr/local/etc/php/php.ini
else
    cp /usr/local/etc/php/php.ini-production /usr/local/etc/php/php.ini
fi

/usr/bin/wait-for-it -h $DATABASE_SERVER -p $DATABASE_SERVER_PORT -t 0
php bin/console secrets:decrypt-to-local
COMPOSER_ALLOW_SUPERUSER=1 composer dump-env $APP_ENV

# if [[ "$APP_ENV" == "dev" ]] ; then
#     php bin/console doctrine:database:create --if-not-exists --no-interaction
# fi

# php bin/console doctrine:migrations:migrate --no-interaction

# if [[ "$APP_ENV" == "dev" ]] ; then
#     php bin/console doctrine:fixtures:load --no-interaction
# fi

# Ensure the cache directory is clean and writable to the webserver user
php bin/console cache:clear
chown -R www-data var

exec php-fpm