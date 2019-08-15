<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class File extends Model
{
    //
	public function actividad()
	{
		return $this->belongsTo('App\Actividad');
	}
}
