<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Division extends Model
{
    //
	public function user()
	{
		return $this->morphTo('App\User');
	}
	public function departamento()
	{
		return $this->belongsTo('App\Departamento');
	}
	public function unidads()
	{
		return $this->hasMany('App\Unidad');
	}

}
