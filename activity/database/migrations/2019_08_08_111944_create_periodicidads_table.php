<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePeriodicidadsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('periodicidads', function (Blueprint $table) {
            $table->bigIncrements('id');
	    $table->unsignedBigInteger('actividad_id')->nullable();
	    $table->string('tipo');
	    $table->string('dia');
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
        Schema::dropIfExists('periodicidads');
    }
}
