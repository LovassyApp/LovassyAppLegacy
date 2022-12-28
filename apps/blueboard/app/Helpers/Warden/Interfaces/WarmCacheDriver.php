<?php

namespace App\Helpers\Warden\Interfaces;

use App\Helpers\Warden\Cache\Models\CacheEntry;
use App\Helpers\Warden\Contracts\Authorizable;

/**
 * The 'Warm' cache driver interface
 * @package Warden
 */
interface WarmCacheDriver
{
    /**
     * Sets the current ColdCacheDriver for use in CacheEntries
     *
     * @param ColdCacheDriver $coldCacheDriver
     * @return void
     */
    public function setColdCache(ColdCacheDriver $cold_cache): void;

    /**
     * Returns the CacheEntry object for a given Authorizable
     *
     * @param Authorizable $authorizable
     * @return CacheEntry
     */
    public function getCache(Authorizable $authorizable): CacheEntry;

    /**
     * Saves a given CacheEntry to the cache
     *
     * @param Authorizable $authorizable
     * @return CacheEntry
     */
    public function setCache(CacheEntry $entry): bool;

    /**
     * Deletes the given CacheEntry from the cache
     *
     * @param Authorizable $authorizable
     * @return CacheEntry
     */
    public function invalidateCache(CacheEntry $entry): bool;

    /**
     * If a deletion was successful, removes the CacheEntry from the queue of deleted entries
     *
     * @param CacheEntry $entry
     * @return boolean
     */
    public function invalidatedSuccess(CacheEntry $entry): bool;

    /**
     * Returns the queue of Authorizable identifiers that need to be invalidated
     *
     * @return array
     */
    public function invalidatedKeys(): array;

    /**
     * Invalidates an array of Authorizable identifiers
     *
     * @param array $keys
     * @return boolean
     */
    public function invalidateRaw(array $keys): bool;

    /**
     * Invalidates the CacheEntry associated with a given Authorizable
     *
     * @param Authorizable $authorizable
     * @return boolean
     */
    public function invalidateAuthorizable(Authorizable $authorizable): bool;

    /**
     * Clean the cache, delete all keys
     *
     * @return boolean
     */
    public function flush(): bool;
}
