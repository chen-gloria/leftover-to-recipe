FROM php:8.3-fpm
ENV APPNAME=leftover

# Basic PHP environment
RUN \
    apt-get update && \
    apt-get autoremove -y && \
    apt-get install unzip wait-for-it libicu-dev libpq-dev zlib1g-dev -y && \
    docker-php-ext-install intl pdo_pgsql pcntl sockets && \
    echo 'extension=intl.so' > /usr/local/etc/php/conf.d/docker-php-ext-intl.ini && \
    rm -rf /var/lib/apt/lists/*

COPY --from=composer /usr/bin/composer /usr/bin/composer

COPY ${APPNAME}/ /var/www/${APPNAME}/

RUN COMPOSER_ALLOW_SUPERUSER=1 composer install --working-dir=/var/www/${APPNAME}/

COPY docker/run.sh /usr/local/bin/run.sh

RUN \
    chmod 700 /usr/local/bin/run.sh

WORKDIR /var/www/${APPNAME}
CMD /usr/local/bin/run.sh