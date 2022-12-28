<?php

namespace App\Helpers\Warden\Cache;

use App\Helpers\Warden\Cache\Models\CacheEntry;
use App\Helpers\Warden\Contracts\Authorizable;
use App\Helpers\Warden\Interfaces\WarmCacheDriver;
use App\Helpers\Shared\Utils\ArrayUtils;
use App\Helpers\Shared\Utils\CheckForSwoole;
use App\Helpers\Warden\Errors\ColdCacheAlreadySetException;
use App\Helpers\Warden\Interfaces\ColdCacheDriver;
use Illuminate\Cache\Repository;
use Illuminate\Support\Facades\Cache;

/**
 * The default warm caching implementation used in Warden
 *  * It uses the Octane cache if available, falling back to the default cache driver in other cases.
 * @package Warden
 */
class WarmCacheManager implements WarmCacheDriver
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
     * The currently loaded cold cache
     *
     * @var ColdCacheDriver
     */
    private ColdCacheDriver|null $cold_cache = null;

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
     * Returns a cache key associated with an Authorizable object
     *
     * @param Authorizable $authorizable
     * @return string
     */
    private function generateCacheKey(Authorizable $authorizable): string
    {
        return $this->cold_cache->cache_prefix() . $authorizable->{$this->cold_cache->authorizableIdentifierKey()};
    }

    /**
     * Constructor. Bootstraps the different caching mechanisms used in Warden.
     */
    public function __construct()
    {
        $this->use_swoole = CheckForSwoole::check();
        $this->setStore();
    }

    /**
     * Sets the currently used ColdCacheDriver
     *
     * @param ColdCacheDriver $cold_cache
     * @return void
     */
    public function setColdCache(ColdCacheDriver $cold_cache): void
    {
        if (!is_null($this->cold_cache)) {
            throw new ColdCacheAlreadySetException();
        }

        $this->cold_cache = $cold_cache;
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
        return new CacheEntry($authorizable, $this, $this->cold_cache, $serialized_data);
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
        $keyValue = $entry->authorizable->{$this->cold_cache->authorizableIdentifierKey()};
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
        $keyValue = $authorizable->{$this->cold_cache->authorizableIdentifierKey()};
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
