<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Departamento extends Model
{
    //
	public function user()
	{
		return $this->morphTo('App\User');
	}
	public function divisions()
	{
		return $this->hasMany('App\Division');
	}
}
