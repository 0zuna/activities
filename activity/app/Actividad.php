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
	public function subActividades()
	{
		return $this->hasMany('App\SubActividad');
	}
	public function jerarquia()
	{
		return $this->hasMany('App\Jerarquia');
	}
	public function confirmacions()
	{
		return $this->hasMany('App\Confirmacion');
	}
	public function periodicidad()
	{
		return $this->hasOne('App\Periodicidad');
	}
	public function files()
	{
		return $this->hasMany('App\File');
	}
	public function reportados()
	{
		return $this->hasMany('App\Reportado');
	}
}
