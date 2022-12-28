<?php

namespace App\Helpers\Warden\Interfaces;

use App\Helpers\Warden\Cache\Models\CacheEntry;
use App\Helpers\Warden\Contracts\Authorizable;

/**
 * The cache driver interface
 * @package Warden
 */
interface CacheDriver
{
    /**
     * Returns the 'Cold' Scope cache (and all permissions in each scope)
     *
     * @return array
     */
    public function scopeCache(): array;

    /**
     * Returns the PermissionString-Class resolutions for all loaded Permission objects
     *
     * @return array
     */
    public function permissionResolutions(): array;

    /**
     * Returns the Class-PermissionString resolutions for all loaded Permission objects
     *
     * @return array
     */
    public function permissionResolutionsFlipped(): array;

    /**
     * Returns the cached array of superuser 'super_key' values
     *
     * @return array
     */
    public function superUserArray(): array;

    /**
     * Returns the cached superuser field on Authorizable objects
     *
     * @return string
     */
    public function authorizableSuperKey(): string;

    /**
     * Returns the cached identifier field on Authorizable objects
     *
     * @return string
     */
    public function authorizableIdentifierKey(): string;

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
     * Resolves a given Permission's PermissionString
     *
     * @param Permission $permission
     * @return string
     */
    public function resolvePermission(Permission $permission): string;

    /**
     * Clean the cache, delete all keys
     *
     * @return boolean
     */
    public function flush(): bool;
}
