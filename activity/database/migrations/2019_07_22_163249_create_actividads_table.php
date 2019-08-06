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
            $table->date('fecha')->nullable();
            $table->time('hora')->nullable();
	    $table->timestamp('confirmacion')->nullable();
            $table->boolean('reporte')->default(false);
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
        Schema::dropIfExists('actividad_user');
        Schema::dropIfExists('actividads');
    }
}
