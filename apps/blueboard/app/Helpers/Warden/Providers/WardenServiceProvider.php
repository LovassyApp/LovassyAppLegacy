<?php

namespace App\Helpers\Warden\Providers;

use App\Helpers\Warden\Services\CacheEntryContainer;
use App\Helpers\Warden\Services\Warden;
use App\Helpers\LibSession\Services\SessionManager;
use Illuminate\Support\ServiceProvider;

/**
 * The service provider for loading Warden as a singleton
 * @package Warden
 */
class WardenServiceProvider extends ServiceProvider
{
    /**
     * Register Warden as a singleton, and the CacheEntryContainer as a scoped singleton
     *
     * @return void
     */
    public function register()
    {
        $this->app->singleton(Warden::class, fn() => new Warden(fn() => SessionManager::user()));

        $this->app->scoped(CacheEntryContainer::class, fn($app) => new CacheEntryContainer($app[Warden::class]));
    }
}
