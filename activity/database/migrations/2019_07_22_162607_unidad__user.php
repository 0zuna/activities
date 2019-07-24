<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UnidadUser extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //
        Schema::create('unidad_user', function (Blueprint $table) {
            $table->bigIncrements('id');
	    $table->unsignedBigInteger('user_id')->nullable();
	    $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
	    $table->unsignedBigInteger('unidad_id')->nullable();
	    $table->foreign('unidad_id')->references('id')->on('unidads')->onDelete('cascade');
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
        Schema::dropIfExists('unidad_user');
    }
}
