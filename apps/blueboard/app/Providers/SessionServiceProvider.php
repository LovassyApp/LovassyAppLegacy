<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Helpers\LibSession\SessionManager;

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
