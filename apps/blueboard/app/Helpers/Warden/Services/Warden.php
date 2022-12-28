<?php

namespace App\Helpers\Warden\Services;

use App\Exceptions\AuthErrorException;
use App\Helpers\Warden\Cache\Models\CacheEntry;
use App\Helpers\Warden\Contracts\Authorizable;
use App\Helpers\Warden\Errors\InvalidPermissionException;
use App\Helpers\Warden\Interfaces\WarmCacheDriver;
use App\Helpers\Warden\Interfaces\Permission;
use App\Helpers\Shared\Interfaces\AbstractSingleton;
use App\Helpers\Warden\Contracts\ResolvesCacheDriver;
use App\Helpers\Warden\Interfaces\ColdCacheDriver;
use Closure;
use Laravel\SerializableClosure\SerializableClosure;

/**
 * The Warden authorization service
 * @package Warden
 */
class Warden extends AbstractSingleton
{
    use ResolvesCacheDriver;

    /**
     * The instance of the warm cache driver currently used in Warden
     *
     * @var WarmCacheDriver
     */
    private WarmCacheDriver $warm_cache;

    /**
     * The instance of the cold cache driver currently used in Warden
     *
     * @var ColdCacheDriver
     */
    private ColdCacheDriver $cold_cache;

    /**
     * The Closure used for resolving the current Authorizable
     *
     * @var SerializableClosure|Closure
     */
    private SerializableClosure|Closure $authorizable_resolver;

    /**
     * Whether this instance of Warden is running as a singleton
     *
     * @var boolean
     */
    private bool $singleton_mode;

    /**
     * If Warden is not running in singleton mode, it loads
     * the current resolved CacheEntry for performance reasons
     *
     * @var CacheEntry|null
     */
    private CacheEntry|null $loadedCache = null;

    /**
     * Returns the Closure for resolving the Authorizable
     * * Supports SerializableClosures, unserializes if necessary
     *
     * @return Closure
     */
    private function getClosure(): Closure
    {
        if ($this->authorizable_resolver instanceof SerializableClosure) {
            return $this->authorizable_resolver->getClosure();
        }
        return $this->authorizable_resolver;
    }

    /**
     * Resolves the current Authorizable
     *
     * @return Authorizable
     */
    private function authorizable(): Authorizable
    {
        return $this->getClosure()->call($this);
    }

    /**
     * Returns the current loaded CacheEntry
     *
     * @return CacheEntry
     */
    private function currentCache(): CacheEntry
    {
        if (!$this->singleton_mode) {
            return $this->loadedCache;
        }
        return CacheEntryContainer::use()->entry;
    }

    /**
     * Resolves the current CacheEntry using the current Authorizable
     *
     * @return CacheEntry
     */
    public function resolveCacheUsingAuthorizable(): CacheEntry
    {
        return $this->warm_cache->getCache($this->authorizable());
    }

    /**
     * Bootstraps Warden and its services
     * * Flushes the cache as well
     *
     * @param SerializableClosure|Closure $authorizable_resolver
     * @param boolean $singleton_mode
     */
    public function __construct(SerializableClosure|Closure $authorizable_resolver, bool $singleton_mode = true)
    {
        $this->authorizable_resolver = $authorizable_resolver;
        $this->cold_cache = self::newColdCacheDriver();
        $this->warm_cache = self::newWarmCacheDriver();
        $this->warm_cache->flush();
        $this->warm_cache->setColdCache($this->cold_cache);
        $this->active = true;
        $this->singleton_mode = $singleton_mode;
        if (!$singleton_mode) {
            $this->loadedCache = $this->resolveCacheUsingAuthorizable();
        }
    }

    /**
     * The main Authorizer function
     * * Checks if the current Authorizable has a given permission or not
     *
     * @param Permission $permission
     * @param boolean $boolean_output
     * @param boolean $skip_super_check
     * @return boolean
     */
    public function authorize(Permission $permission, bool $boolean_output = true, bool $skip_super_check = false): bool
    {
        $cache = $this->currentCache();

        $result = match (true) {
            !$skip_super_check && $cache->is_authorizable_super => true,
            true => $cache->get($permission),
        };

        if (!$boolean_output && !$result) {
            $this->renderOutput($permission);
        }

        return $result;
    }

    /**
     * Returns whether the current Authorizable is a SuperUser or not
     *
     * @return boolean
     */
    public function isSuperAdmin(): bool
    {
        $cache = $this->currentCache();
        return $cache->is_authorizable_super;
    }

    /**
     * Invalidates the cache for an Authorizable or an array of identifiers
     *
     * @param Authorizable|array $invalidated
     * @return void
     */
    public function invalidate(Authorizable|array $invalidated): void
    {
        $driver = $this->warm_cache;
        if (is_array($invalidated)) {
            $driver->invalidateRaw($invalidated);
            return;
        }

        $driver->invalidateAuthorizable($invalidated);
        return;
    }

    /**
     * Returns all the permissions associated with the current Authorizable
     *
     * @return array
     */
    public function getAllPermissions(): array
    {
        $cache = $this->currentCache();
        return $cache->allPermissions();
    }

    /**
     * Returns the list of Permissions grouped by scope
     *
     * @return array
     */
    public function getDisplayPermissionList(): array
    {
        $all_permissions = [];
        foreach ($this->cold_cache->scopeCache() as $scopeName => $permissions) {
            $all_permissions[$scopeName] = (object) [
                'scopeDisplayName' => $scopeName,
                'permissions' => $permissions,
            ];
        }

        return $all_permissions;
    }

    /**
     * Validates an array of PermissionStrings
     *
     * @param array $permissionStringArray
     * @return boolean
     */
    public function validatePermissions(array $permissionStringArray): bool
    {
        foreach ($permissionStringArray as $permissionString) {
            if (in_array($permissionString, $this->cold_cache->permissionResolutionsFlipped())) {
                continue;
            } else {
                throw new InvalidPermissionException("Invalid Permission $permissionString");
            }
        }

        return true;
    }

    /**
     * Throws an exception for a given Permission
     *
     * @param Permission $permission
     * @return void
     */
    private function renderOutput(Permission $permission)
    {
        throw new AuthErrorException($permission->defaultErrorMessage(), 403);
    }

    /**
     * Returns an array of every single registered Permission
     *
     * @return array
     */
    public static function getAllScopedPermissions(): array
    {
        $cold_cache = self::newColdCacheDriver();
        return array_values($cold_cache->permissionResolutionsFlipped());
    }

    /**
     * Returns the currently loaded Warden instance
     *
     * @return self
     */
    public static function use(): self
    {
        return app(self::class);
    }
}
