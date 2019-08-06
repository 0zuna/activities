<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Jerarquia extends Model
{
    //
	public function actividads(){
		return $this->belongsTo('App\Actividad');
	}
}
