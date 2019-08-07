<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateConfirmacionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('confirmacions', function (Blueprint $table) {
            $table->bigIncrements('id');
	    $table->unsignedBigInteger('actividad_id')->nullable();
	    $table->foreign('actividad_id')->references('id')->on('actividads')->onDelete('cascade');
	    $table->unsignedBigInteger('user_id')->nullable();
	    $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->date('fecha')->nullable();
            $table->time('hora')->nullable();
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
        Schema::dropIfExists('confirmacions');
    }
}
