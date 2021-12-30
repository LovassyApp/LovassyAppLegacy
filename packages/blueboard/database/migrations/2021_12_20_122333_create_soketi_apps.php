<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSoketiApps extends Migration
{
	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('soketi_apps', function (Blueprint $table) {
			$table->string('id');
			$table->primary('id');
			$table->timestamps();
			$table->string('key');
			$table->string('secret');
			$table->integer('max_connections');
			$table->boolean('enable_client_messages');
			$table->boolean('enabled');
			$table->integer('max_backend_events_per_sec');
			$table->integer('max_client_events_per_sec');
			$table->integer('max_read_req_per_sec');
			$table->json('webhooks');
		});

		DB::table('soketi_apps')->insert([
			'id' => config('broadcasting.connections.pusher.app_id'),
			'key' => config('broadcasting.connections.pusher.key'),
			'secret' => config('broadcasting.connections.pusher.secret'),
			'max_connections' => -1,
			'enable_client_messages' => 0,
			'enabled' => 1,
			'max_backend_events_per_sec' => -1,
			'max_client_events_per_sec' => -1,
			'max_read_req_per_sec' => -1,
			'webhooks' => json_encode([]),
		]);
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::dropIfExists('soketi_apps');
	}
}
