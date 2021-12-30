<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProductsTable extends Migration
{
	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('products', function (Blueprint $table) {
			$table->id();
			$table->timestamps();
			$table->string('name')->unique();
			$table->string('description');
			$table->longText('markdownContent');
			$table->boolean('codeActivated');
			$table->integer('price');
			$table->integer('quantity');
			$table->longText('inputs');
			$table->string('imageName');
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::dropIfExists('products');
	}
}
