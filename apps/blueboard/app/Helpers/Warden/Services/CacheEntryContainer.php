<?php

namespace App\Helpers\Warden\Services;

use App\Helpers\Warden\Cache\Models\CacheEntry;
use App\Helpers\Shared\Interfaces\AbstractSingleton;

/**
 * A Singleton class used as a container for the current resolved CacheEntry
 * Intended as a small optimization to the Warden flow
 * @package Warden
 *
 */
class CacheEntryContainer extends AbstractSingleton
{
    /**
     * The currently loaded CacheEntry
     *
     * @var CacheEntry
     */
    public readonly CacheEntry $entry;

    /**
     * Loads the CacheEntry via the current Warden instance
     *
     * @param Warden $permissionManager
     */
    public function __construct(Warden $permissionManager)
    {
        $this->entry = $permissionManager->resolveCacheUsingAuthorizable();
        $this->active = true;
    }

    /**
     * Returns the currently loaded instance of itself
     *
     * @return self
     */
    public static function use(): static
    {
        return app(self::class);
    }
}
