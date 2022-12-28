<?php

namespace App\Helpers\Warden\Cache\Models;

use App\Helpers\Warden\Contracts\Authorizable;
use App\Helpers\Warden\Interfaces\CacheDriver;
use App\Helpers\Warden\Interfaces\Permission;
/**
 * The entry associated with an Authorizable in the cache
 * @package Warden
 */
class CacheEntry
{
    /**
     * Does the Authorizable have SuperUser permissions
     *
     * @var boolean
     */
    public readonly bool $is_authorizable_super;

    /**
     * The Authorizable associated with this entry
     *
     * @var Authorizable
     */
    public readonly Authorizable $authorizable;

    /**
     * The currently loaded cache driver
     *
     * @var CacheDriver
     */
    private CacheDriver $cache;

    /**
     * Every Permission of the associated Authorizable
     *
     * @var array
     */
    private array $cached_permissions;

    /**
     * The already determined Permissions
     *
     * @var array
     */
    private array $all_permissions;

    /**
     * Resumes an entry from JSON
     *
     * @param string $serialized_data
     * @return void
     */
    private function unserialize(string $serialized_data): void
    {
        $saved = json_decode($serialized_data, true) ?? [
            'cached_permissions' => [],
            'all_permissions' => $this->setAllPermissions(),
        ];
        $this->cached_permissions = $saved['cached_permissions'];
        $this->all_permissions = $saved['all_permissions'];
    }

    /**
     * Suspends an entry to JSON
     *
     * @return string
     */
    public function serialize(): string
    {
        return json_encode(
            (object) [
                'cached_permissions' => $this->cached_permissions,
                'all_permissions' => $this->all_permissions,
            ]
        );
    }

    /**
     * Determines whether the Authorizable is a SuperUser or not
     *
     * @return boolean
     */
    private function setSuper(): bool
    {
        $key = $this->cache->authorizableSuperKey();
        return in_array($this->authorizable->{$key}, $this->cache->superUserArray());
    }

    /**
     * Checks if the entry is in the invalidation Queue
     *
     * If it is, the entry is invalidated and refreshed
     *
     * @return boolean
     */
    private function checkInvalidate(): bool
    {
        $key = $this->cache->authorizableIdentifierKey();
        if (in_array($this->authorizable->{$key}, $this->cache->invalidatedKeys())) {
            $this->cache->invalidateCache($this);
            $this->cache->invalidatedSuccess($this);
            return true;
        }
        return false;
    }

    /**
     * Constructor, Bootstraps the Entry, checks for invalidation, and loads the permissions if necessary.
     *
     * @param Authorizable $authorizable
     * @param CacheDriver $cache
     * @param string $serialized_data
     */
    public function __construct(Authorizable $authorizable, CacheDriver $cache, string $serialized_data)
    {
        $this->authorizable = $authorizable;
        $this->cache = $cache;
        $this->is_authorizable_super = $this->setSuper();
        if ($this->checkInvalidate()) {
            $this->all_permissions = $this->setAllPermissions();
            $this->cached_permissions = [];
        } else {
            $this->unserialize($serialized_data);
        }
    }

    /**
     * Loads all the permissions from the Database
     *
     * @return array
     */
    public function setAllPermissions(): array
    {
        $group_permissions = $this->authorizable
            ->groups()
            ->get()
            ->pluck('permissions')
            ->toArray();
        return array_merge(...$group_permissions);
    }

    /**
     * Returns all of the permissions of the Authorizable associated with the entry
     *
     * @return array
     */
    public function allPermissions(): array
    {
        return $this->all_permissions;
    }

    /**
     * Tries to determine whether the Authorizable has a given permission or
     * not from the list of already determined permissions.
     *
     * @param string $permissionString
     * @return boolean|null Null, if the Permission has not yet been determined
     */
    private function tryCache(string $permissionString): bool|null
    {
        if (array_key_exists($permissionString, $this->cached_permissions)) {
            return $this->cached_permissions[$permissionString];
        }

        return null;
    }

    /**
     * Determines if the user has a permission or not
     *
     * @param Permission $permission
     * @return boolean
     */
    public function get(Permission $permission): bool
    {
        $permissionString = $this->cache->resolvePermission($permission);
        return $this->tryCache($permissionString) ??
            ($this->cached_permissions[$permissionString] = (bool) in_array($permissionString, $this->all_permissions));
    }

    /**
     * Suspends itself to JSON, and writes to the cache on shutdown
     */
    public function __destruct()
    {
        $this->cache->setCache($this);
    }
}
