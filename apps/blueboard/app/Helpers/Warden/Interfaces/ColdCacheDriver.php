<?php

namespace App\Helpers\Warden\Interfaces;

/**
 * The 'Cold' cache driver interface
 */
interface ColdCacheDriver
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
     * Returns the cached prefix applied to all keys in a given cache store
     *
     * @return string
     */
    public function cache_prefix(): string;

    /**
     * Resolves a given Permission's PermissionString
     *
     * @param Permission $permission
     * @return string
     */
    public function resolvePermission(Permission $permission): string;
}
