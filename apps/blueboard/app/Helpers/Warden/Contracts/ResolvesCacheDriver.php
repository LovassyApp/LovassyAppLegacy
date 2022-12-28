<?php

namespace App\Helpers\Warden\Contracts;

use App\Helpers\Warden\Interfaces\ColdCacheDriver;
use App\Helpers\Warden\Interfaces\WarmCacheDriver;

/**
 * Trait used for resolving the currently configured CacheDrivers
 * @package Warden
 */
trait ResolvesCacheDriver
{
    /**
     * Returns a new instance of the configured warm cache driver
     *
     * @return WarmCacheDriver
     */
    private static function newWarmCacheDriver(): WarmCacheDriver
    {
        $driver = config('warden.warm_cache_driver');
        return new $driver();
    }

    /**
     * Returns a new instance of the configured warm cache driver
     *
     * @return ColdCacheDriver
     */
    private static function newColdCacheDriver(): ColdCacheDriver
    {
        $driver = config('warden.cold_cache_driver');
        return new $driver();
    }
}
