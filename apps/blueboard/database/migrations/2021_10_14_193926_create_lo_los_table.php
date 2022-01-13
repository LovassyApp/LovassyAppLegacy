<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateLolosTable extends Migration
{
	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('lolos', function (Blueprint $table) {
			$table->id();
			$table->timestamps();
			$table->bigInteger('user_id');
			$table->bigInteger('history_id')->nullable();
			$table->boolean('isSpent');
			$table->longText('reason');
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::dropIfExists('lolos');
	}
}
