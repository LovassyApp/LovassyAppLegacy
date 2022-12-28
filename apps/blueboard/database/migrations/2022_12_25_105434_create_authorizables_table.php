<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('authorizables', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string('authorizable_type');
            $table->foreignId('authorizable_id');
            $table->foreignId('authorizable_group_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('authorizables');
    }
};
