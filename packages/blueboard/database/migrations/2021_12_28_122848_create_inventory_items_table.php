<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateInventoryItemsTable extends Migration
{
	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('inventory_items', function (Blueprint $table) {
			$table->id();
			$table->timestamps();
			$table->bigInteger('product_id');
			$table->bigInteger('history_id');
			$table->bigInteger('user_id');
			$table
				->dateTime('used_at')
				->nullable()
				->default(null);
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::dropIfExists('inventory_items');
	}
}
