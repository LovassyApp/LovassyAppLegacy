<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Helpers\PermissionManager\PermissionHelper;

class AppServiceProvider extends ServiceProvider
{
	/**
	 * Register any application services.
	 *
	 * @return void
	 */
	public function register()
	{
		$this->app->singleton(PermissionHelper::class, function ($app) {
			return new PermissionHelper(true);
		});
	}

	/**
	 * Bootstrap any application services.
	 *
	 * @return void
	 */
	public function boot()
	{
		//
	}
}
