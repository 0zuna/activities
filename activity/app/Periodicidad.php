<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Periodicidad extends Model
{
    //
	public function actividad()
	{
		return $this->belongsTo('App\Actividad');
	}
}
