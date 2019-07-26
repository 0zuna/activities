<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ActividadUser extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //
        Schema::create('actividad_user', function (Blueprint $table) {
            $table->bigIncrements('id');
	    $table->unsignedBigInteger('user_id')->nullable();
	    $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
	    $table->unsignedBigInteger('actividad_id')->nullable();
	    $table->foreign('actividad_id')->references('id')->on('actividads')->onDelete('cascade');
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
        //
        Schema::dropIfExists('user_actividad');
    }
}
