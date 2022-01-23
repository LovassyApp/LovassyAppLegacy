FROM blueboard
WORKDIR /var/www/api/

RUN pecl uninstall xdebug
RUN rm /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini

CMD ["php", "artisan", "horizon"]
