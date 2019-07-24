<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateDivisionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('divisions', function (Blueprint $table) {
            $table->bigIncrements('id');
	    $table->string('division');
	    $table->string('telefono')->nullable();
	    $table->unsignedBigInteger('user_id')->nullable();
	    $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
	    $table->unsignedBigInteger('departamento_id')->nullable();
	    $table->foreign('departamento_id')->references('id')->on('departamentos')->onDelete('cascade');
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
        Schema::dropIfExists('divisions');
    }
}
