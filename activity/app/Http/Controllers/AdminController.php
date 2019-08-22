<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Departamento;
use App\Division;
use App\User;
use App\Actividad;
use App\Mail\NotifyMail;
use App\SubActividad;
use App\Jerarquia;
use App\Periodicidad;
use App\Confirmacion;
use Carbon\Carbon;


class AdminController extends Controller
{
    //
	public function assignFechaEntrega($actos){
		foreach ($actos as $k=>$v) {
			if($v->tipo=='unica'){
				$actos[$k]->fechaEntrega=$v->fecha;
				$actos[$k]->horaEntrega=$v->hora;
			}
			if($v->tipo=='diaria'){
				$actos[$k]->fechaEntrega=date('Y-m-d');
				$actos[$k]->horaEntrega=$v->hora;
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
		return $actos;
	}
	public function evalua($actos){
		$actos=$this->assignFechaEntrega($actos);
		foreach ($actos as $k=>$v) {
			if($v->tipo=='unica'){
				$conf=Confirmacion::where('actividad_id',$v->id)->where('fecha',$v->fecha)->first();
				if($conf){
					$actos[$k]->status=$conf->realizada;
				}
				else{
					$actos[$k]->status=-1;
				}
					
			}
			if($v->tipo=='diaria'){
				$conf=Confirmacion::where('actividad_id',$v->id)->where('fecha',date('Y-m-d'))->first();
				if($conf){
					$actos[$k]->status=$conf->realizada;
				}
				else{
					$actos[$k]->status=-1;
				}
			}
			if($v->tipo=='semanal'||$v->tipo=='mensual'){
				$conf=Confirmacion::where('actividad_id',$v->id)->where('created_at','like',$v->fechaEntrega.'%')->first();
				if($conf){
					$actos[$k]->status=$conf->realizada;
				}
				else{
					$actos[$k]->status=-1;
				}
			}
		}
		return $actos;
	}

	public function index(){
		$depa=Departamento::with(['divisions'=>function($q){
			$q->with(['unidads'=>function($q){
				$q->with(['actividades'=>function($q){
						$q->with(['subActividades','users','periodicidad']);
					}]);
			}]);
		}])->get();
		foreach ($depa as $k=>$v){
			$depa[$k]->user=User::find($v->user_id);
			foreach ($v->divisions as $i=>$vv) {
				$depa[$k]->divisions[$i]->user=User::find($vv->user_id);
				foreach ($vv->unidads as $j=>$v) {
					$actos=$this->evalua($depa[$k]->divisions[$i]->unidads[$j]->actividades);
					unset($depa[$k]->divisions[$i]->unidads[$j]->actividades);
					$depa[$k]->divisions[$i]->unidads[$j]->actividades=$actos;//$this->evalua($v->actividades);
					$done=0;
					$notDone=0;
					$inProcess=0;
					foreach ($actos as $acto) {
						if($acto->status==1)
							$done++;
						if($acto->status==0)
							$noDone++;
						if($acto->status==-1)
							$inProcess++;
					}
					$depa[$k]->divisions[$i]->unidads[$j]->done=$done;
					$depa[$k]->divisions[$i]->unidads[$j]->notDone=$notDone;
					$depa[$k]->divisions[$i]->unidads[$j]->inProcess=$inProcess;
				}
			}
		}
		return response()->json($depa);
	}
	public function users(){
		return response()->json(User::all());
	}
	public function jefe_dep(Request $request){
		$dep=Departamento::find($request->departamento_id);
		$dep->user_id=$request->user_id;
		$dep->update();
	}
	public function jefe_div(Request $request){
		$div=Division::find($request->division_id);
		$div->user_id=$request->user_id;
		$div->update();
	}
	public function actividad_user(Request $request){
		$actividades=User::find($request->user_id)->actividades()->get();
		return response()->json($actividades);
	}
	public function newActivityToUser(Request $request){
		global $user;
        	$user = User::find($request->user_id);
		$actividad=new Actividad();
		$actividad->actividad=$request->actividad;
		$actividad->save();
        	$actividad->users()->attach($user);
		\Mail::send('mail.text', ['actividad'=>$actividad->actividad], function ($message) {
			global $user;
			$message->from('desarrollo@usupso.com.mx', 'Usupso System');
			$message->subject('Nueva Actividad');
			$message->to($user->email);
		});
		return response()->json($actividad);
	}
	public function updateActivity(Request $request){
		$act=Actividad::find($request->id);
		$act->descripcion=$request->descripcion;
		$act->fecha=$request->fecha;
		$act->tipo=$request->tipo;
		$act->hora=$request->hora;
		$act->update();
		if($request->tipo=='diaria'||$request->tipo=='unica'){
			$periodicidad=Periodicidad::where('actividad_id',$act->id)->first();
			if(!empty($periodicidad))
				$periodicidad->delete();
		}
		if($request->tipo=='semanal'||$request->tipo=='mensual'){
			$periodicidad=Periodicidad::where('actividad_id',$act->id)->first();
			if(!empty($periodicidad)){
				$periodicidad->tipo=$request->tipo;
				$periodicidad->dia=$request->periodicidadDia;
				$periodicidad->update();
			}
			else{
				$periodicidad=new Periodicidad();
				$periodicidad->actividad_id=$act->id;
				$periodicidad->tipo=$request->tipo;
				$periodicidad->dia=$request->periodicidadDia;
				$periodicidad->save();
			}
		}
		return response()->json($act);
	}
	public function newSubActivity(Request $request)
	{
		$sub=new SubActividad();
		$sub->actividad_id=$request->actividad_id;
		$sub->subactividad=$request->subactividad;
		$sub->status='En Proceso';
		$sub->save();
		return response()->json($sub);
	}
	public function assignActivity(Request $request)
	{
		global $user;
		$user=User::find($request->user_id);
		$acti=Actividad::find($request->actividad_id);
        	$acti->users()->attach($user);
		\Mail::send('mail.text', ['actividad'=>$acti->actividad], function ($message) {
			global $user;
			$message->from('desarrollo@usupso.com.mx', 'Usupso System');
			$message->subject('Usupso Activity');
			$message->to($user->email);
		});
		return response()->json($request);
	}
	public function unAssignActivity(Request $request)
	{
		$user=User::find($request->user_id);
		$acti=Actividad::find($request->actividad_id);
        	$acti->users()->detach($user);
		return response()->json($request);
	}
	public function newActivity(Request $request)
	{
		$actividad=new Actividad();
		$actividad->unidad_id=$request->unidad_id;
		$actividad->actividad=$request->actividad;
		$actividad->save();
		$actividad->users=[];
		return response()->json($actividad);
	}
	public function pushJerarquia(Request $request)
	{
		$actividad=Jerarquia::where('act_referencia',$request->actividad_id)->first();
		if(!$actividad){
			$jerarquia=new Jerarquia();
			$jerarquia->actividad_id=$request->actividad_id;
			$jerarquia->act_referencia=$request->actividad_id;
			$jerarquia->save();
		}
		$jerarquia=new Jerarquia();
		$jerarquia->actividad_id=$request->actividad_id;
		$jerarquia->act_referencia=$request->act_referencia;
		$jerarquia->save();
		return response()->json($request);
	}
	public function updateJerarquia(Request $request)
	{
		foreach ($request->actividades as $k=>$v) {
			$jerarqui=Jerarquia::where('actividad_id',$request->actividad_id)->where('act_referencia',$v['id'])->first();
			$jerarqui->fase=$k+1;
			$jerarqui->update();
		}
		return response()->json($request);
	}
	public function entrega($acto){
			if($v->tipo=='semanal'||$v->tipo=='mensual'){
				$solicitada=Carbon::createFromFormat('Y-m-d H:i:s', $v->fechaConfirmacion);
				$entregada=Carbon::createFromFormat('Y-m-d H:i:s',$v->fechaEntregada.' '.$v->horaEntregada);
				$horaSolicitada=Carbon::createFromFormat('Y-m-d H:i:s',$v->fechaEntregada.' '.$v->horaSolicitada);
				if($entregada<=$solicitada&&$entregada<$horaSolicitada){
					$acto->entregadaATiempo=true;
				}else{
					$acto->entregadaATiempo=false;
				}
				
			}
			if($v->tipo=='diaria'){
				$solicitada=Carbon::createFromFormat('Y-m-d H:i:s', $v->fechaConfirmacion);
				$entregada=Carbon::createFromFormat('Y-m-d H:i:s',$v->fechaEntregada.' '.$v->horaEntregada);
				$horaSolicitada=Carbon::createFromFormat('Y-m-d H:i:s',$v->fechaEntregada.' '.$v->horaSolicitada);
				if($solicitada==$entregada&&$entregada<$horaSolicitada){
					$acto->entregadaATiempo=true;
				}else{
					$acto->entregadaATiempo=false;
				}
			}
			if($v->tipo=='unica'){
				$solicitada=Carbon::createFromFormat('Y-m-d H:i:s', $v->fechaSolicitada.' '.$v->horaSolicitada);
				$entregada=Carbon::createFromFormat('Y-m-d H:i:s',$v->fechaEntregada.' '.$v->horaEntregada);
				if($entregada<$solicitada){
					$acto->entregadaATiempo=true;
				}else{
					$acto->entregadaATiempo=false;
				}
			}
	}
	public function status($actividad){
		return $actividad;
		if($actividad->periodicidad=='unica'){
			$confirmacion=Confirmacion::where('actividad_id',$actividad->id)->first();
		}
	}

	public function actividadJerarquia(Request $request)
	{
		$actividades=[];
		$je=Jerarquia::where('act_referencia',$request->act_referencia)->first();
		if($je){
		$jerarquia=Jerarquia::where('actividad_id',$je->actividad_id)->orderBy('fase')->get();
		foreach ($jerarquia as $jera){
			//$actividad=Actividad::with(['users','unidad'])->where('id', $jera->act_referencia)->first();
			$actos=Actividad::with(['users','files','confirmacions'=>function($q){$q->orderBy('created_at','desc')->first();}])
				->select('actividads.*','unidads.unidad','divisions.division','departamentos.departamento')
				->join('unidads','actividads.unidad_id','unidads.id')
				->join('divisions','unidads.division_id','divisions.id')
				->join('departamentos','divisions.departamento_id','departamentos.id')
				->where('actividads.id', $jera->act_referencia)
				->first();
			$actos=$this->evalua([$actos]);
			array_push($actividades, $actos[0]);
		}
		}
		return response()->json($actividades);
	}
	public function deleteJerarquia(Request $request)
	{
		$acto=Jerarquia::where('act_referencia',$request->act_referencia)
			->where('actividad_id',$request->actividad_id)
			->delete();
		return response()->json($request);
	}
}
