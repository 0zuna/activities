<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Reportado extends Model
{
    //
    public function actividades()
    {
	return $this->belongsToMany('App\Actividad');
    }
    public function users()
    {
	return $this->belongsToMany('App\User');
    }
}
