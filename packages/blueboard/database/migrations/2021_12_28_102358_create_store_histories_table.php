<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateStoreHistoriesTable extends Migration
{
	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('store_histories', function (Blueprint $table) {
			$table->id();
			$table->timestamps();
			$table->longText('reason');
			$table->bigInteger('product_id');
			$table->bigInteger('item_id')->nullable();
			$table->bigInteger('user_id');
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::dropIfExists('store_histories');
	}
}
