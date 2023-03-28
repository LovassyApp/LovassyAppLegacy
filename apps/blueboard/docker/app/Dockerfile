FROM php:8.2.3-fpm-alpine3.17

WORKDIR /srv/www

RUN echo 'Installing packages...'
RUN apk update && \
    apk add npm nodejs

RUN apk add bzip2-dev \
    freetype-dev \
    libjpeg-turbo-dev \
    libpng-dev \
    postgresql-client \
    figlet \
    mc \
    vim \
    unzip \
    openssl \
    libpq-dev \
    libzip-dev \
    libxml2-dev

RUN echo 'Installing PHP extensions...'
RUN docker-php-ext-configure gd && \
    docker-php-ext-install -j8 bcmath \
    bz2 \
    exif \
    opcache \
    pdo_pgsql \
    pdo_mysql \
    zip \
    pcntl \
    gd \
    dom

# Stuff for shared memory
# shmop \
# sysvmsg \
# sysvsem \
# sysvshm

RUN apk --no-cache add pcre-dev imagemagick-dev linux-headers ${PHPIZE_DEPS}

# PECL extensions
RUN pecl install redis-5.3.7
RUN pecl install imagick-3.7.0
RUN pecl install openswoole-4.12.1
RUN pecl install xdebug-3.2.0

RUN docker-php-ext-enable openswoole redis imagick gd dom

RUN apk add net-tools\
    bind-tools \
    busybox-extras \
    iputils \
    supervisor \
    nginx \
    iptables \
    bash

RUN echo "export COMPOSER_ALLOW_SUPERUSER=1" > /etc/profile.d/composer.sh && \
    curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin/ --filename=composer

# Config 'n stuff
COPY php.ini /usr/local/etc/php/
COPY mercury.sh /
COPY nginx.conf /etc/nginx/
COPY xdebug.ini /usr/local/etc/php/conf.d/
COPY opcache.ini /usr/local/etc/php/conf.d/
COPY supervisord.conf /etc/
RUN chmod 777 /mercury.sh

CMD ["bash", "/mercury.sh"]
