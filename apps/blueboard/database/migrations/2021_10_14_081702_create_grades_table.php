<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateGradesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('grades', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->bigInteger('user_id');
            $table->bigInteger('lolo_id')->nullable();
            $table->string('uid')->unique();
            $table->string('bounds');
            $table->string('subject');
            $table->string('teacher');
            $table->integer('grade');
            $table->string('textGrade');
            $table->string('shortTextGrade');
            $table->integer('weight');
            $table->string('date');
            $table->string('name');
            $table->string('type');
            $table->string('gradeType');
            $table->integer('evaluationType');
            $table->string('evaluationTypeDescription');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('grades');
    }
}
