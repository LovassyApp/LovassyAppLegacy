<?php

namespace App\Providers;

use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\ServiceProvider;
use Illuminate\Contracts\Foundation\CachesRoutes;
use Illuminate\Broadcasting\BroadcastController;

class BroadcastServiceProvider extends ServiceProvider
{
	/**
	 * Bootstrap any application services.
	 *
	 * @return void
	 */
	public function boot()
	{
		require base_path('routes/channels.php');
	}
}
