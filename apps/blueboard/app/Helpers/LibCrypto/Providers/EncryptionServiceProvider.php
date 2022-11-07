<?php

namespace App\Helpers\LibCrypto\Providers;

use App\Helpers\LibCrypto\Services\EncryptionManager;
use App\Helpers\LibSession\Services\SessionManager;
use Illuminate\Support\ServiceProvider;
/**
 * A titkosító Providere
 */
class EncryptionServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->singleton(EncryptionManager::class, function ($app) {
            return new EncryptionManager($app[SessionManager::class]);
        });
    }

    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot()
    {
        //
    }
}
