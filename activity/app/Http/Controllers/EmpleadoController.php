<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\User;
use App\Confirmacion;
use Carbon\Carbon;
use App\Actividad;
use App\File;
use App\Reportado;

class EmpleadoController extends Controller
{
    //
	public function getUser(Request $request){
		//$user=User::find($request->user_id)->with(['actividades']);
		$user=User::with(['unidades'=>function($q){
			$q->with(['division'=>function($q){
					$q->with(['departamento']);
				}]);
		}])->find($request->user_id);
		//$user->unidades();
		return response()->json($user);
	}
	public function setUser(Request $request){
		$user=User::find($request->id);
		$user->name=$request->name;
		$user->paterno=$request->paterno;
		$user->materno=$request->materno;
		$user->celular=$request->celular;
		$user->puesto=$request->puesto;
		$user->sobremi=$request->sobremi;
		if($request->password)
		$user->password=bcrypt($request->password);
		$user->update();
		return response()->json($user);
	}
	public function uploadImage(Request $request){
		$path = storage_path().'/img/users/';
		file_put_contents($path.$request->user_id.'.jpeg', base64_decode(explode(',',$request->img)[1]));
		return response()->json($request);
	}
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
					$q->where('fecha',date('Y-m-d'))->where('realizada',1);
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
	public function mensajera(Request $request)
	{
		global $from, $to, $mensaje;
		$from=User::find($request->from);
		$to=User::find($request->to);
		$mensaje=$request->mensaje;
		\Mail::send('mail.text', ['actividad'=>$mensaje], function ($message) {
			global $from, $to;
			$message->from('desarrollo@usupso.com.mx', 'Usupso System');
			$message->subject('Usted tiene un mensaje de '.$from->name);
			$message->to($to->email);
		});
		return response()->json($request);
	}
	public function reportar(Request $request)
	{
		foreach ($request->users as $user) {
			$report= new Reportado();
			$report->actividad_id=$request->actividad_id;
			$report->user_id=$user['id'];
			$report->reportante=$request->user()->id;
			$report->save();
		}
		return response()->json($request);
	}
	public function assigned(Request $request)
	{
		//$actos=$request->user()->actividades->with(['periodicidad']);
		$actos=User::with(['actividades'=>function($q){
			$q->with(['confirmacions','periodicidad'])->where('actividads.fecha','>=',date('Y-m-d'))->orWhereIn('tipo',['diaria','semanal','mensual']);
		}])->where('users.id',$request->user()->id)->get();
		$actos=$actos[0]->actividades;
		foreach ($actos as $k=>$v) {
			if($v->tipo=='unica'){
				$actos[$k]->fechaEntrega=$v->fecha.' '.$v->hora;
			}
			if($v->tipo=='diaria'){
				$actos[$k]->fechaEntrega=date('Y-m-d').' '.$v->hora;
			}
			if($v->tipo=='semanal'){
				$days=['lunes'=>1,'martes'=>2,'miercoles'=>3,'jueves'=>4,'viernes'=>5,'sabado'=>6];
				$diaSolicita=$days[$v->periodicidad->dia];//1
				$diaNow=Carbon::now()->dayOfWeek;//3
				$diasRestantes=abs(abs($diaSolicita-$diaNow)-7);
				$newDay=Carbon::now()->addDay($diasRestantes);
				$actos[$k]->fechaEntrega=$newDay->format('Y-m-d');
				$actos[$k]->horaEntrega=$v->hora;
			}
			if($v->tipo=='mensual'){
				$days=['lunes'=>1,'martes'=>2,'miercoles'=>3,'jueves'=>4,'viernes'=>5,'sabado'=>6];
				$now=Carbon::now();
				if($now->day<=7){
					$diaSolicita=$days[$v->periodicidad->dia];//1
					$diaNow=Carbon::now()->dayOfWeek;//3
					if($diaNow==0)
					$diasRestantes=abs(abs($diaSolicita-$diaNow));
					else
					$diasRestantes=abs(abs($diaSolicita-$diaNow)-7);
					$newDay=Carbon::now()->addDay($diasRestantes);
					$actos[$k]->fechaEntrega=$newDay->format('Y-m-d');
					$actos[$k]->horaEntrega=$v->hora;
				}
				else{
					$startDay = Carbon::now()->startOfMonth()->addMonth();
					$diaSolicita=$days[$v->periodicidad->dia];//1
					$diaNow=$startDay->dayOfWeek;//0
					if($diaNow==0)
					$diasRestantes=abs(abs($diaSolicita-$diaNow));
					else
					$diasRestantes=abs(abs($diaSolicita-$diaNow)-7);
					$newDay=$startDay->addDay($diasRestantes);
					$actos[$k]->fechaEntrega=$newDay->format('Y-m-d');
					$actos[$k]->horaEntrega=$v->hora;
					$actos[$k]->test=$startDay;
				}
			}
		}
		return response()->json($actos);
	}
	public function hecha(Request $request)
	{
		$conf=new Confirmacion();
		$conf->actividad_id=$request->actividad_id;
		$conf->user_id=$request->user()->id;
		$conf->fecha=date('Y-m-d');
		$conf->hora=date('H:i:s');
		$conf->created_at=$request->fechaEntrega;
		$conf->save();
		return response()->json($conf);
	}
	public function notDone(Request $request)
	{
		$conf=Confirmacion::where('actividad_id',$request->id)
			->where('created_at',date('Y-m-d').' '.$request->hora)
			->where('realizada',0)
			->first();
		if(!$conf){
			$conf=new Confirmacion();
			$conf->actividad_id=$request->id;
			$conf->user_id=$request->user()->id;
			$conf->fecha=date('Y-m-d');
			$conf->hora=$request->hora;
			$conf->realizada=false;
			$conf->created_at=date('Y-m-d').' '.$request->hora;
			$conf->save();
		}
		return response()->json($conf);
	}
}
