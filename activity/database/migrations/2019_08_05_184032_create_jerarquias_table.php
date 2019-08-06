<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateJerarquiasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('jerarquias', function (Blueprint $table) {
            $table->bigIncrements('id');
	    $table->unsignedBigInteger('actividad_id')->nullable();
	    $table->foreign('actividad_id')->references('id')->on('actividads')->onDelete('cascade');
	    $table->unsignedBigInteger('act_referencia')->nullable();
	    $table->foreign('act_referencia')->references('id')->on('actividads')->onDelete('cascade');
	    $table->unsignedBigInteger('fase')->nullable();
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
        Schema::dropIfExists('jerarquias');
    }
}
