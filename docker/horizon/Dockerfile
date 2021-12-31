FROM llgapp-app
WORKDIR /var/www/api/

RUN rm /usr/local/etc/php/conf.d/xdebug.ini

CMD ["php", "artisan", "horizon"]