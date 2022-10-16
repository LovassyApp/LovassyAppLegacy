<?php

namespace App\Helpers\LibSession\Providers;

use App\Helpers\LibSession\Services\SessionManager;
use Illuminate\Support\ServiceProvider;

class SessionServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->singleton(SessionManager::class, function ($app) {
            return new SessionManager();
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
