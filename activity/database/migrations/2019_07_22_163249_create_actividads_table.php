<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateActividadsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('actividads', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('actividad');
            $table->string('descripcion')->nullable();
	    $table->string('status')->default('En Proceso');
            $table->boolean('reporte')->default(false);
	    $table->foreign('unidad_id')->references('id')->on('unidads')->onDelete('cascade');
	    $table->unsignedBigInteger('unidad_id')->nullable();
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
        Schema::dropIfExists('actividads');
    }
}
