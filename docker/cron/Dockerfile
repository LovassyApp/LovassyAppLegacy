FROM llgapp-app
WORKDIR /var/www/

RUN rm /usr/local/etc/php/conf.d/xdebug.ini

COPY crontabs /var/spool/cron/crontabs/

RUN apt-get install -y cron
RUN touch /var/log/cron.log

CMD ["cron", "-f", "-L", "8"]