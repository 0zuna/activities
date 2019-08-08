<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\User;
use App\Confirmacion;

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
		$actividades=User::find($request->user_id)
			->actividades()
			->where('fecha',date('Y-m-d'))
			->with(['confirmacions'])
			->get();
		/*foreach ($actividades as $k=>$v) {
			return response()->json($v);
		}*/
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
		return response()->json($request);
	}
}
