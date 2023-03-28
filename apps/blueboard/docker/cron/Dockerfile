FROM blueboard
WORKDIR /srv/www/

RUN pecl uninstall xdebug
# rm /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini

COPY crontabs /var/spool/cron/crontabs/

CMD ["crond", "-f", "-l", "8", "-L", "/dev/stdout"]
