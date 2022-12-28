<?php

namespace App\Helpers\Warden\Contracts;

use App\Helpers\Warden\Interfaces\CacheDriver;

/**
 * Trait used for resolving the currently configured CacheDriver
 */
trait ResolvesCacheDriver
{
    /**
     * Returns a new instance of the configured cache driver
     *
     * @return CacheDriver
     */
    private static function newCacheDriver(): CacheDriver
    {
        $driver = config('warden.cache_driver');
        return new $driver();
    }
}
