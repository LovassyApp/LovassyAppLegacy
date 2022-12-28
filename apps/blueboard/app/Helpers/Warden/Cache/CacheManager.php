<?php

namespace App\Helpers\Warden\Cache;

use App\Helpers\Warden\Cache\Models\CacheEntry;
use App\Helpers\Warden\Contracts\Authorizable;
use App\Helpers\Warden\Errors\PermissionNotResolvedException;
use App\Helpers\Warden\Interfaces\CacheDriver;
use App\Helpers\Warden\Interfaces\Permission;
use App\Helpers\Shared\Utils\ArrayUtils;
use App\Helpers\Shared\Utils\CheckForSwoole;
use App\Helpers\Shared\Utils\ConsoleLogger;
use Illuminate\Cache\Repository;
use Illuminate\Support\Facades\Cache;

/**
 * The default caching implementation used in Warden
 *  * It uses the Octane cache if available, falling back to the default cache driver in other cases.
 * @package Warden
 */
class CacheManager implements CacheDriver
{
    /**
     * The prefix applied to all keys
     */
    private const PREFIX = 'Warden.';

    /**
     * Caching interval. Set to 7 days for safety reasons
     */
    private const INTERVAL = 604800;

    /**
     * Resolved Permissions and their PermissionStrings
     *
     * @var array
     */
    private array $permission_resolutions;

    /**
     * The same as 'permission_resolutions', but the key-value pairs are flipped
     *
     * @var array
     */
    private array $permission_resolutions_flipped;

    /**
     * The cached permission scopes, and all of their permissions
     *
     * @var array
     */
    private array $scope_cache;

    /**
     * To swoole or not to swoole (Determines whether the Octane caching mechanism is used or not)
     *
     * @var boolean
     */
    private bool $use_swoole = false;

    /**
     * The caching repository on which the manager performs its operations on
     *
     * @var Repository|null
     */
    private Repository|null $store = null;

    /**
     * The configured identifier field on Authorizable objects
     *
     * @var string
     */
    private string $authorizable_identifier_key;

    /**
     * The prefix applied to all Authorizable cache entries
     *
     * @var string
     */
    private string $cache_prefix;

    /**
     * The configured superuser field on Authorizable objects
     *
     * @var string
     */
    private string $authorizable_super_key;

    /**
     * The configured array of valid superuser 'super_key' values
     *
     * @var array
     */
    private array $super_user_array;

    /**
     * Reads the keys that the CacheManager has written from the cache
     *
     * Used for cleaning up the cache on shutdown
     *
     * @return array
     */
    private function cache_stored_keys(): array
    {
        return json_decode($this->cache_read('keys') ?? '[]') ?? [];
    }

    /**
     * Stores a key that the CacheManager has written to the cache
     *
     * Used for keeping track of all the keys we have touched
     * @param string $key
     * @return boolean
     */
    private function cache_store_key(string $key): bool
    {
        $keys = $this->cache_stored_keys();
        return $this->store->put(
            self::PREFIX . 'keys',
            json_encode(ArrayUtils::pushUnique($keys, $key)),
            self::INTERVAL
        );
    }

    /**
     * Deletes a key that the CacheManager has written to the cache
     *
     * Used for cleaning up the cache on invalidation
     * @param string $key
     * @return boolean
     */
    private function cache_store_key_delete(string $key): bool
    {
        $keys = $this->cache_stored_keys();
        return $this->store->put(
            self::PREFIX . 'keys',
            json_encode(ArrayUtils::deleteIfExists($keys, $key)),
            self::INTERVAL
        );
    }

    /**
     * Writes a key-value pair to the cache
     *
     * @param string $key
     * @param string $value
     * @return boolean
     */
    private function cache_write(string $key, string $value): bool
    {
        return $this->cache_store_key($key) && $this->store->put(self::PREFIX . $key, $value, self::INTERVAL);
    }

    /**
     * Returns a value associated with the given key from the cache
     *
     * @param string $key
     * @return string|null
     */
    private function cache_read(string $key): string|null
    {
        $val = (string) $this->store->get(self::PREFIX . $key);
        return $val ?? null;
    }

    /**
     * Deletes a key (and its value) from the cache
     *
     * @param string $key
     * @return boolean
     */
    private function cache_delete(string $key): bool
    {
        return $this->cache_store_key_delete($key) && $this->store->forget(self::PREFIX . $key);
    }

    /**
     * Loads the 'Cold' cache information containing the Permission map, and resolutions
     *
     * @return void
     */
    private function loadColdCache(): void
    {
        if (!file_exists(config('warden.cache_path'))) {
            ConsoleLogger::log_warning('Cache unavailable. Rebuilding...', 'PermissionCacheManager');
            CacheBuilder::rebuild();
            ConsoleLogger::log_success('Cache rebuild successfully! Booting...', 'PermissionCacheManager');
        }

        $cached = require config('warden.cache_path');
        $this->permission_resolutions = $cached['permission_resolutions'];
        $this->permission_resolutions_flipped = $cached['permission_resolutions_flipped'];
        $this->scope_cache = $cached['scope_cache'];
    }

    /**
     * Sets the used cache repository
     *
     * @return void
     */
    private function setStore(): void
    {
        if ($this->use_swoole) {
            $this->store = Cache::store('octane');
            return;
        }

        $this->store = Cache::store();
    }

    /**
     * Caches the configuration on startup
     *
     * @return void
     */
    private function loadConfig(): void
    {
        $this->authorizable_identifier_key = config('warden.authorizable_key');
        $this->cache_prefix = config('warden.cache_prefix');
        $this->authorizable_super_key = config('warden.authorizable_super_key');
        $this->super_user_array = config('warden.superusers');
    }

    /**
     * Returns a cache key associated with an Authorizable object
     *
     * @param Authorizable $authorizable
     * @return string
     */
    private function generateCacheKey(Authorizable $authorizable): string
    {
        return $this->cache_prefix . $authorizable->{$this->authorizable_identifier_key};
    }

    /**
     * Constructor. Bootstraps the different caching mechanisms used in Warden.
     */
    public function __construct()
    {
        $this->use_swoole = CheckForSwoole::check();
        $this->loadConfig();
        $this->loadColdCache();
        $this->setStore();
    }

    /**
     * Returns the 'Cold' Scope cache (and all permissions in each scope)
     *
     * @return array
     */
    public function scopeCache(): array
    {
        return $this->scope_cache;
    }

    /**
     * Returns the PermissionString-Class resolutions for all loaded Permission objects
     *
     * @return array
     */
    public function permissionResolutions(): array
    {
        return $this->permission_resolutions;
    }

    /**
     * Returns the Class-PermissionString resolutions for all loaded Permission objects
     *
     * @return array
     */
    public function permissionResolutionsFlipped(): array
    {
        return $this->permission_resolutions_flipped;
    }

    /**
     * Returns the cached superuser field on Authorizable objects
     *
     * @return string
     */
    public function authorizableSuperKey(): string
    {
        return $this->authorizable_super_key;
    }

    /**
     * Returns the cached identifier field on Authorizable objects
     *
     * @return string
     */
    public function authorizableIdentifierKey(): string
    {
        return $this->authorizable_identifier_key;
    }

    /**
     * Returns the cached array of superuser 'super_key' values
     *
     * @return array
     */
    public function superUserArray(): array
    {
        return $this->super_user_array;
    }

    /**
     * Returns the CacheEntry object for a given Authorizable
     *
     * @param Authorizable $authorizable
     * @return CacheEntry
     */
    public function getCache(Authorizable $authorizable): CacheEntry
    {
        $serialized_data = $this->cache_read($this->generateCacheKey($authorizable));
        return new CacheEntry($authorizable, $this, $serialized_data);
    }

    /**
     * Saves a given CacheEntry to the cache
     *
     * @param Authorizable $authorizable
     * @return CacheEntry
     */
    public function setCache(CacheEntry $entry): bool
    {
        $serialized_data = $entry->serialize();
        return $this->cache_write($this->generateCacheKey($entry->authorizable), $serialized_data);
    }

    /**
     * Deletes the given CacheEntry from the cache
     *
     * @param Authorizable $authorizable
     * @return CacheEntry
     */
    public function invalidateCache(CacheEntry $entry): bool
    {
        return $this->cache_delete($this->generateCacheKey($entry->authorizable));
    }

    /**
     * If a deletion was successful, removes the CacheEntry from the queue of deleted entries
     *
     * @param CacheEntry $entry
     * @return boolean
     */
    public function invalidatedSuccess(CacheEntry $entry): bool
    {
        $invalidated_keys = $this->invalidatedKeys();
        $keyValue = $entry->authorizable->{$this->authorizable_identifier_key};
        $array = ArrayUtils::deleteIfExists($invalidated_keys, $keyValue);
        return $this->cache_write('invalidated', json_encode($array));
    }

    /**
     * Returns all the Authorizable identifiers that need to be invalidated
     *
     * @return array
     */
    public function invalidatedKeys(): array
    {
        $data = $this->cache_read('invalidated') ?? '[]';
        return json_decode($data) ?? [];
    }

    /**
     * Invalidates the CacheEntry associated with a given Authorizable
     *
     * @param Authorizable $authorizable
     * @return boolean
     */
    public function invalidateAuthorizable(Authorizable $authorizable): bool
    {
        $keyValue = $authorizable->{$this->authorizable_identifier_key};
        $array = array_unique([...$this->invalidatedKeys(), $keyValue]);
        return $this->cache_write('invalidated', json_encode($array));
    }

    /**
     * Invalidates an array of Authorizable identifiers
     *
     * @param array $keys
     * @return boolean
     */
    public function invalidateRaw(array $keys): bool
    {
        $array = array_unique([...$this->invalidatedKeys(), ...$keys]);
        return $this->cache_write('invalidated', json_encode($array));
    }

    /**
     * Resolves a given Permission's PermissionString
     *
     * @param Permission $permission
     * @return string
     */
    public function resolvePermission(Permission $permission): string
    {
        if (array_key_exists($permission::class, $this->permission_resolutions_flipped)) {
            return $this->permission_resolutions_flipped[$permission::class];
        }
        throw new PermissionNotResolvedException(
            'Permission ' . $permission::class . ' could not be resolved from the Cache. Please rebuild'
        );
    }

    /**
     * Cleans up the cache from all the keys that have been written
     *
     * @return boolean
     */
    public function flush(): bool
    {
        $keys = $this->cache_stored_keys();
        foreach ($keys as $key) {
            $this->cache_delete($key);
        }

        return true;
    }
}
