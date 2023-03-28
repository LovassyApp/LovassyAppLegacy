#!/bin/bash
cd /var/www/api

xdebug_config() {
    if [ ! -f /usr/local/etc/php/conf.d/xdebug.ini ]; then
        echo "Xdebug not configured! Configuring with defaults..."
        cp /usr/local/etc/php/conf.d/xdebug.ini.example /usr/local/etc/php/conf.d/xdebug.ini
    fi
}

xdebug_host_force() {
    if [ -v FORCED_DEBUG_HOST ]; then
        echo "FORCED_DEBUG_HOST is set..."
        xdebug_config
        echo "Rewriting Xdebug config..."
        sed -i '/^[^#]/ s/\(^.*xdebug.client_host.*$\)/#\ \1/' /usr/local/etc/php/conf.d/xdebug.ini
        echo "xdebug.client_host = $FORCED_DEBUG_HOST" >>/usr/local/etc/php/conf.d/xdebug.ini
    fi
}

composer() {
    echo "Installing dependencies using composer..."
    /usr/local/bin/composer update
}

laravel_cache() {
    echo "Cleaning Laravel caches..."
    /usr/local/bin/php artisan config:cache
    /usr/local/bin/php artisan optimize:clear
}

laravel_env() {
    if [ ! -f .env ]; then
        echo "No .env file found! Copying example..."
        cp .env.example .env
        chmod 666 .env
        echo "Generating app key..."
        /usr/local/bin/php artisan key:generate
    fi
}

laravel_migrate() {
    echo "Running migrations..."
    /usr/local/bin/php artisan migrate --force
}

set_lock() {
    touch /root/firststart.lock
}

# Totally dumb, and even more unnescessary. To be fair, it does look cool...
figlet "Blueboard"

echo "Starting Blueboard..."
# Check if this is the first start of Blueboard...
if [ ! -f /root/firststart.lock ]; then
    echo "Preparing Blueboard since this is the first start..."
    xdebug_config
    composer
    laravel_env
    laravel_cache
    laravel_migrate
    set_lock

    echo "Done! Starting Blueboard..."
fi

xdebug_host_force

# Start Blueboard as normal...
/usr/local/bin/php artisan octane:start --watch --host=0.0.0.0 --port=80
