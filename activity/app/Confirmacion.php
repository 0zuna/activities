<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Confirmacion extends Model
{
    //
	public function actividad()
	{
		return $this->belongsToMany('App\Actividad');
	}
	public function user()
	{
		return $this->belongsToMany('App\User');
	}
}
