FROM php:8.2-bullseye
WORKDIR /var/www/api

# Refresh APT repos, APT utils
RUN apt-get update && apt-get install -y apt-utils curl bash

# NodeJS v16 repo
RUN curl -fsSL https://deb.nodesource.com/setup_16.x | bash -

# Install dependencies with APT
RUN apt-get install -y libbz2-dev \
    libfreetype6-dev \
    libjpeg62-turbo-dev \
    libpng-dev \
    libgeoip-dev \
    libmcrypt-dev \
    libxml2-dev \
    poppler-utils \
    libzip-dev \
    libmagickwand-dev \
    unzip \
    nodejs \
    # Yep, really
    mariadb-client \
    vim \
    mc \
    figlet

# Base extensions
RUN docker-php-ext-configure gd && \
    docker-php-ext-install -j8 bcmath \
    bz2 \
    calendar \
    dba \
    exif \
    gd \
    gettext \
    mysqli \
    opcache \
    pdo_mysql \
    shmop \
    soap \
    sysvmsg \
    pcntl \
    zip && \
    docker-php-ext-install -j8 sysvsem sysvshm

# PECL extensions
RUN pecl install redis && \
    # pecl install xdebug && \
    pecl install imagick && \
    pecl install openswoole && \
    # docker-php-ext-enable xdebug openswoole imagick redis
    docker-php-ext-enable openswoole imagick redis

# Composer
RUN echo "export COMPOSER_ALLOW_SUPERUSER=1" > /etc/profile.d/composer.sh && \
    curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin/ --filename=composer

# Config 'n stuff
RUN rm -rf /var/www/html
COPY php.ini /usr/local/etc/php/
COPY xdebug.ini* /usr/local/etc/php/conf.d/
RUN touch /var/log/xdebug.log
COPY entrypoint.sh /
RUN chmod 777 /entrypoint.sh

CMD ["bash", "/entrypoint.sh"]
