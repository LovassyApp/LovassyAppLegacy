<?php

use App\Helpers\Warden\Cache\ColdCacheManager;
use App\Helpers\Warden\Cache\WarmCacheManager;

return [
    /*
    |--------------------------------------------------------------------------
    | Default Access Denied Message
    |--------------------------------------------------------------------------
    |
    | Here you can define the default access denied message used in the
    | Permission classes.
    |
    */

    'page_denied' => "You don't have permission to use this object.",

    /*
    |--------------------------------------------------------------------------
    | Permission namespace
    |--------------------------------------------------------------------------
    |
    | The namespace where Permission classes are autoloaded from
    |
    */

    'permission_namespace' => 'App\\Permissions',

    /*
    |--------------------------------------------------------------------------
    | Cache folder
    |--------------------------------------------------------------------------
    |
    | The folder where the PermissionCache is stored
    |
    */

    'cache_folder' => 'permission_cache',

    /*
    |--------------------------------------------------------------------------
    | Cache filename
    |--------------------------------------------------------------------------
    |
    | The filename for the PermissionCache
    |
    */

    'cache_filename' => 'cache.php',

    /*
    |--------------------------------------------------------------------------
    | Cache path
    |--------------------------------------------------------------------------
    |
    | Full path of the cache file
    |
    */

    'cache_path' => storage_path('permission_cache/cache.php'),

    /*
    |--------------------------------------------------------------------------
    | Authorizable key field
    |--------------------------------------------------------------------------
    |
    | The unique field the PermissionCache will use on authorizables
    |
    */

    'authorizable_key' => 'id',

    /*
    |--------------------------------------------------------------------------
    | Authorizable SuperUser field
    |--------------------------------------------------------------------------
    |
    | The field the PermissionCache will use to determine if a given
    | authorizable has SuperUser permissions or not
    |
    */

    'authorizable_super_key' => 'email',

    /*
    |--------------------------------------------------------------------------
    | Cache Prefix
    |--------------------------------------------------------------------------
    |
    | The prefix used by the cache driver to store authorizables
    |
    */

    'cache_prefix' => 'authorizable-',

    /*
    |--------------------------------------------------------------------------
    | SuperUser array
    |--------------------------------------------------------------------------
    |
    | This array contains the array of SuperUser values of 'authorizable_super_key'
    | (An array of E-mail addresses by default)
    |
    */

    'superusers' => ['example@example.com'],

    /*
    |--------------------------------------------------------------------------
    | Warm Cache Driver
    |--------------------------------------------------------------------------
    |
    | The default 'Warm' Caching driver used by Warden
    |
    */

    'warm_cache_driver' => WarmCacheManager::class,

    /*
    |--------------------------------------------------------------------------
    | Cold Cache Driver
    |--------------------------------------------------------------------------
    |
    | The default 'Cold' Caching driver used by Warden
    |
    */

    'cold_cache_driver' => ColdCacheManager::class,
];
