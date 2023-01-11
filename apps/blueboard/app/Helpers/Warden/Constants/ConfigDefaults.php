<?php

namespace App\Helpers\Warden\Constants;

use App\Helpers\Warden\Cache\ColdCacheManager;
use App\Helpers\Warden\Cache\WarmCacheManager;

class ConfigDefaults
{
    public const PAGE_DENIED = "You don't have permission to use this object.";
    public const PERMISSION_NAMESPACE = 'App\\Permissions';
    public const CACHE_FOLDER = 'warden_permission_cache';
    public const CACHE_PATH = 'permission_cache/cache.php';
    public const AUTHORIZABLE_KEY = 'id';
    public const AUTHORIZABLE_SUPER_KEY = 'email';
    public const CACHE_PREFIX = 'authorizable-';
    public const SUPERUSERS = [];
    public const WARM_CACHE_DRIVER = WarmCacheManager::class;
    public const COLD_CACHE_DRIVER = ColdCacheManager::class;
}
