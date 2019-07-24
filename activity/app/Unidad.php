<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Unidad extends Model
{
    //
	public function division()
	{
		return $this->belongsTo('App\Division');
	}
	public function actividades()
	{
		return $this->hasMany('App\Actividad');
	}
}
