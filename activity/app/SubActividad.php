<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class SubActividad extends Model
{
    //
	public function actividad()
	{
		return $this->belongsTo('App\Actividad');
	}
}
