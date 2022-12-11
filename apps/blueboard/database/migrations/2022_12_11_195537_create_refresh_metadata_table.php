<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRefreshMetadataTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('refresh_metadata', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string('password_encrypted');
            $table->foreignId('metadata_owner_id');
            $table->string('metadata_owner_type');
            $table->string('salt');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('refresh_metadata');
    }
}
