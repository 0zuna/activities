<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\User;
use App\Confirmacion;
use Carbon\Carbon;
use App\Actividad;
use App\File;

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
			->with([
				'periodicidad',
				'files'=>function($q){
					$q->where('fecha',date('Y-m-d'));
				},
				'confirmacions'=>function($q){
					$q->where('fecha',date('Y-m-d'));
				}
			])
			->get();

		return $actividades->filter(function ($a) {
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
	public function activitiesDone(Request $request)
	{
		$actividades=Actividad::join('confirmacions','actividads.id','confirmacions.actividad_id')
			->leftJoin('periodicidads','actividads.id','periodicidads.actividad_id')
			->select('actividads.*','periodicidads.dia','actividads.hora as horaSolicitada','confirmacions.hora as horaEntregada','actividads.fecha as fechaSolicitada','confirmacions.fecha as fechaEntregada','confirmacions.created_at as fechaConfirmacion')
			->where('confirmacions.user_id',$request->user()->id)
			->where('confirmacions.realizada',1)
			->orderBy('confirmacions.fecha','desc')
			//->with(['periodicidad'])
			->get();
		foreach ($actividades as $k=>$v){
			if($v->tipo=='semanal'||$v->tipo=='mensual'){
				$solicitada=Carbon::createFromFormat('Y-m-d H:i:s', $v->fechaConfirmacion);
				$entregada=Carbon::createFromFormat('Y-m-d H:i:s',$v->fechaEntregada.' '.$v->horaEntregada);
				$horaSolicitada=Carbon::createFromFormat('Y-m-d H:i:s',$v->fechaEntregada.' '.$v->horaSolicitada);
				if($entregada<=$solicitada&&$entregada<$horaSolicitada){
					$actividades[$k]->entregadaATiempo=true;
				}else{
					$actividades[$k]->entregadaATiempo=false;
				}
				
			}
			if($v->tipo=='diaria'){
				$solicitada=Carbon::createFromFormat('Y-m-d H:i:s', $v->fechaConfirmacion);
				$entregada=Carbon::createFromFormat('Y-m-d H:i:s',$v->fechaEntregada.' '.$v->horaEntregada);
				$horaSolicitada=Carbon::createFromFormat('Y-m-d H:i:s',$v->fechaEntregada.' '.$v->horaSolicitada);
				if($solicitada==$entregada&&$entregada<$horaSolicitada){
					$actividades[$k]->entregadaATiempo=true;
				}else{
					$actividades[$k]->entregadaATiempo=false;
				}
			}
			if($v->tipo=='unica'){
				$solicitada=Carbon::createFromFormat('Y-m-d H:i:s', $v->fechaSolicitada.' '.$v->horaSolicitada);
				$entregada=Carbon::createFromFormat('Y-m-d H:i:s',$v->fechaEntregada.' '.$v->horaEntregada);
				if($entregada<$solicitada){
					$actividades[$k]->entregadaATiempo=true;
				}else{
					$actividades[$k]->entregadaATiempo=false;
				}
			}
		}
		return response()->json($actividades);
	}
	public function fileUpload(Request $request){
		$path = storage_path().'/File/'.$request->actividad_id."/";
		$name = Carbon::now()."_".$request->name;
		if(!\File::exists($path)) {
			\File::makeDirectory($path, $mode = 0777, true, true);
		}
		file_put_contents($path.$name, base64_decode(explode(',',$request->data)[1]));
		$file=new File();
		$file->name='/File/'.$request->actividad_id."/".$name;
		$file->fecha=date('Y-m-d');
		$file->actividad_id=$request->actividad_id;
		$file->save();
		return response()->json($file);
	}
	public function deleteFileUpload($id){
		File::destroy($id);
		return response()->json(null, 204);
	}
	public function activitiesForget(Request $request)
	{
		$actividades=Actividad::join('confirmacions','actividads.id','confirmacions.actividad_id')
			->leftJoin('periodicidads','actividads.id','periodicidads.actividad_id')
			->select('actividads.*','periodicidads.dia','actividads.hora as horaSolicitada','confirmacions.hora as horaEntregada','actividads.fecha as fechaSolicitada','confirmacions.fecha as fechaEntregada','confirmacions.created_at as fechaConfirmacion')
			->where('confirmacions.user_id',$request->user()->id)
			->where('confirmacions.realizada',0)
			->orderBy('confirmacions.fecha','desc')
			//->with(['periodicidad'])
			->get();
		foreach ($actividades as $k=>$v){
			if($v->tipo=='semanal'||$v->tipo=='mensual'){
				$solicitada=Carbon::createFromFormat('Y-m-d H:i:s', $v->fechaConfirmacion);
				$entregada=Carbon::createFromFormat('Y-m-d H:i:s',$v->fechaEntregada.' '.$v->horaEntregada);
				$horaSolicitada=Carbon::createFromFormat('Y-m-d H:i:s',$v->fechaEntregada.' '.$v->horaSolicitada);
				if($entregada<=$solicitada&&$entregada<$horaSolicitada){
					$actividades[$k]->entregadaATiempo=true;
				}else{
					$actividades[$k]->entregadaATiempo=false;
				}
				
			}
			if($v->tipo=='diaria'){
				$solicitada=Carbon::createFromFormat('Y-m-d H:i:s', $v->fechaConfirmacion);
				$entregada=Carbon::createFromFormat('Y-m-d H:i:s',$v->fechaEntregada.' '.$v->horaEntregada);
				$horaSolicitada=Carbon::createFromFormat('Y-m-d H:i:s',$v->fechaEntregada.' '.$v->horaSolicitada);
				if($solicitada==$entregada&&$entregada<$horaSolicitada){
					$actividades[$k]->entregadaATiempo=true;
				}else{
					$actividades[$k]->entregadaATiempo=false;
				}
			}
			if($v->tipo=='unica'){
				$solicitada=Carbon::createFromFormat('Y-m-d H:i:s', $v->fechaSolicitada.' '.$v->horaSolicitada);
				$entregada=Carbon::createFromFormat('Y-m-d H:i:s',$v->fechaEntregada.' '.$v->horaEntregada);
				if($entregada<$solicitada){
					$actividades[$k]->entregadaATiempo=true;
				}else{
					$actividades[$k]->entregadaATiempo=false;
				}
			}
		}
		return response()->json($actividades);
	}
	public function activityForgetDone(Request $request)
	{
		$confirmacion=Confirmacion::where('actividad_id',$request->id)
			->where('created_at',$request->fechaConfirmacion)
			->first();
		$confirmacion->fecha=date('Y-m-d');
		$confirmacion->hora=date('H:i:s');
		$confirmacion->realizada=true;
		$confirmacion->update();
		return response()->json($confirmacion);
	}
}
