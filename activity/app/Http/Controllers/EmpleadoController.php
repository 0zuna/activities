<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\User;
use App\Confirmacion;
use Carbon\Carbon;

class EmpleadoController extends Controller
{
    //
	public function misActividades(Request $request)
	{
		$actividades=User::find($request->user_id)
			->actividades()
			->get();
		return response()->json($actividades);
	}
	public function misActividadesHoy(Request $request)
	{
		//return date('l');
		$dia=Carbon::now()->locale('es')->dayName;
		$user=User::find($request->user_id);
		$actividades=$user->actividades()
			->with(['periodicidad','confirmacions'=>function($q){
				$q->where('fecha',date('Y-m-d'));
			}])
			->get();
		return$actividades->filter(function ($a) {
			if($a->tipo=='semanal'){
				return $a->periodicidad->dia==Carbon::now()->locale('es')->dayName;
			}
			if($a->tipo=='mensual'){
				return $a->periodicidad->dia==Carbon::now()->locale('es')->dayName&&Carbon::now()->day<7;
			}
			return $a->fecha==date('Y-m-d')||$a->tipo=='diaria';
		})->values()->all();

		return response()->json($actividades);
	}
	public function activityDone(Request $request)
	{
		$confirmacion = new Confirmacion();
		$confirmacion->actividad_id=$request->actividad_id;
		$confirmacion->user_id=$request->user_id;
		$confirmacion->fecha=date("Y-m-d");
		$confirmacion->hora=date("H:i:s");
		$confirmacion->save();
		return response()->json($confirmacion);
	}
}
