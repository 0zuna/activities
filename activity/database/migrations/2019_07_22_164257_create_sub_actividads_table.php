<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateSubActividadsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sub_actividads', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->integer('prioridad');
            $table->string('subactividad');
            $table->string('status');
	    $table->foreign('actividad_id')->references('id')->on('actividads')->onDelete('cascade');
	    $table->unsignedBigInteger('actividad_id')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('sub_actividads');
    }
}
