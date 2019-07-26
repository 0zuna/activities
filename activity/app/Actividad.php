<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Actividad extends Model
{
    //
	public function unidad()
	{
		return $this->belongsTo('App\Unidad');
	}
	public function users()
	{
		return $this->belongsToMany('App\User');
	}
}
