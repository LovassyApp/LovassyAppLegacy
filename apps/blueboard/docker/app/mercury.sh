#!/bin/bash
set -e

cd /srv/www
env_file=".env"
key="MERCURY_MODE"
mode=""
modes=(fpm octane)
app_name=$(cat $env_file | grep APP_NAME= | sed -E 's/^APP_NAME=//')
mercury_version="0.1"

composer() {
    echo "# Installing dependencies using Composer..."
    $(which composer) update
}

npm() {
    echo "# Installing dependencies using npm..."
    /usr/bin/npm update
}

laravel_cache() {
    echo "# Cleaning Laravel caches..."
    /usr/local/bin/php artisan config:cache
    /usr/local/bin/php artisan optimize:clear
}

laravel_env() {
    if [ ! -f .env ]; then
        echo "# No .env file found! Copying example..."
        cp .env.example .env
        # I shall not comment this one lol
        chmod 666 .env
        echo "# Generating app key..."
        /usr/local/bin/php artisan key:generate
    fi
}

laravel_migrate() {
    echo "# Running migrations..."
    /usr/local/bin/php artisan migrate --force
}

set_lock() {
    touch "/root/mercury-$app_name.lock"
}

get_mode() {
    mode=$(cat $env_file | grep $key | sed -E "s/^$key=//")
    if [ -z "$mode" ]; then
        echo "No mode specified. Exiting."
        exit 1
    fi

    if [[ ${modes[*]} =~ (^|[[:space:]])"$mode"($|[[:space:]]) ]]; then
        echo "# Mode: $mode"
    else
        echo "Invalid mode: $mode. Exiting."
        exit 1
    fi
}

firstboot() {
    # Check if this is the first start of Mercury...
    if [ ! -f "/root/mercury-$app_name.lock" ]; then
        echo "# Preparing $app_name for first run..."
        composer
        npm
        laravel_env
        laravel_cache
        laravel_migrate
        set_lock

        echo "# Done! Starting $app_name..."
    fi
}

xdebug_kill() {
    if [ -f /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini ]; then
        rm /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini
    fi
}

boot() {
    # Start Mercury as normal...
    case $mode in
    'fpm')
        echo "# Booting FPM..."
        docker-php-ext-enable xdebug
        touch /var/log/xdebug.log
        mkdir -p /var/log/supervisor
        touch /var/log/supervisor/supervisord.log
        # Boot PHP-FPM with Nginx
        /usr/bin/supervisord -c /etc/supervisord.conf
        ;;

    'octane')
        echo "# Booting OpenSwoole..."
        xdebug_kill
        # Boot OpenSwoole via Laravel Octane
        /usr/local/bin/php artisan octane:start --watch --host=0.0.0.0 --port=80
        ;;
    esac
}

# Totally dumb, and even more unnescessary. To be fair, it does look cool...
figlet "Mercury"
echo "Mercury runtime v$mercury_version"
echo "Booting your application..."

echo "# Starting $app_name..."
firstboot
get_mode
boot
