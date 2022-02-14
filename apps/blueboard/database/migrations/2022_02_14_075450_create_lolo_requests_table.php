<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateLoloRequestsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('lolo_requests', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->text('body');
            $table->string('title');
            $table->bigInteger('user_id');
            $table->string('accepted_at')->nullable();
            $table->string('denied_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('lolo_requests');
    }
}
