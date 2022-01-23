FROM blueboard
WORKDIR /var/www/api/

RUN pecl uninstall xdebug
RUN rm /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini

COPY crontabs /var/spool/cron/crontabs/

RUN apt-get install -y cron
RUN touch /var/log/cron.log

CMD ["cron", "-f", "-L", "8"]
