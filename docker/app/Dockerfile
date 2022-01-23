FROM php:8-fpm
WORKDIR /var/www/api/

RUN apt-get update && \
    apt-get install -y apt-utils libbz2-dev \
    libfreetype6-dev \
    libjpeg62-turbo-dev \
    libpng-dev \
    libgeoip-dev \
    libmcrypt-dev \
    libxml2-dev \
    poppler-utils \
    libzip-dev \
    unzip && \
    docker-php-ext-configure gd && \
    docker-php-ext-install -j5 bcmath \
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
    #sockets \
    sysvmsg \ 
    pcntl \
    zip && \
    docker-php-ext-install -j5 sysvsem sysvshm && \
    pecl install xdebug && \
    docker-php-ext-enable xdebug

RUN pecl install redis && docker-php-ext-enable redis

RUN apt-get update && apt-get install -y libmagickwand-dev --no-install-recommends && rm -rf /var/lib/apt/lists/*
RUN printf "\n" | pecl install imagick
RUN docker-php-ext-enable imagick

RUN echo "export COMPOSER_ALLOW_SUPERUSER=1" > /etc/profile.d/composer.sh && \
    curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin/ --filename=composer
WORKDIR /var/www/api
RUN rm -rf /var/www/html
RUN apt-get update
RUN apt-get install -y mariadb-client vim

COPY php.ini /usr/local/etc/php/
COPY xdebug.ini /usr/local/etc/php/conf.d/
RUN touch /var/log/xdebug.log
